import crypto from "node:crypto";
import { __CONFIG__ } from "@/app/config";
import { AuthProviderFactory } from "@/app/modules/oauth2/oauth2factory";
import { userService } from "@/handlers/services/users.service";
import utils from "@/utils";
import helpers from "@/utils/helpers";
import type {
	GoogleAuthProviderResponse,
	ID_TOKEN,
} from "@/utils/interfaces/provider.interface";
import { MailService } from "@/utils/services/mail/mailService";
import { Cache } from "@/utils/services/redis/cacheService";
import type { Request, Response } from "express";
const emailSvc = MailService.createInstance();
const provider = AuthProviderFactory.createProvider(
	"google",
	process.env.GOOGLE_CLIENT_ID || "test-client-id",
	process.env.GOOGLE_CLIENT_SECRET || "test-client-secret",
	process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/callback",
);

const RESET_TOKEN_PREFIX = "reset-token:";
const RESET_TOKEN_TTL = 15 * 60; // 15 minutes
class AuthController {
	async ResetPassword(req: Request, res: Response) {
		try {
			const { password, confirmPassword, token, email } = req.body;

			if (!password || !confirmPassword || password !== confirmPassword) {
				res.status(400).json({ message: "Passwords do not match or are invalid.", result: null, success: false });
				return;
			}

			if (typeof password !== "string" || password.length < 8) {
				res.status(400).json({ message: "Password must be at least 8 characters.", result: null, success: false });
				return;
			}

			if (!token || !email) {
				res.status(400).json({ message: "Invalid reset link.", result: null, success: false });
				return;
			}

			const storedToken = await Cache.cache.get(`${RESET_TOKEN_PREFIX}${email}`);
			if (!storedToken) {
				res.status(400).json({ message: "Invalid or expired token.", result: null, success: false });
				return;
			}

			// Timing-safe comparison to prevent timing attacks
			const tokenBuf = Buffer.from(String(token));
			const storedBuf = Buffer.from(storedToken);
			if (tokenBuf.length !== storedBuf.length || !crypto.timingSafeEqual(tokenBuf, storedBuf)) {
				res.status(400).json({ message: "Invalid or expired token.", result: null, success: false });
				return;
			}

			const user = await userService.getUserBy({
				where: { email: String(email) },
				select: { id: true, email: true },
			});
			if (!user) {
				res.status(400).json({ message: "Invalid or expired token.", result: null, success: false });
				return;
			}

			await userService.updateUserPassword(
				String(email),
				await utils.HashPassword(password),
			);

			// Invalidate the token after successful reset
			await Cache.cache.del(`${RESET_TOKEN_PREFIX}${email}`);

			res.json({
				result: null,
				success: true,
				message: "Password reset successfully.",
			});
		} catch (error: any) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	}
	async ForgotPassword(req: Request, res: Response) {
		try {
			const email = req.body?.email as string;
			if (!email || typeof email !== "string") {
				res.status(400).json({ message: "Email is required", result: null, success: false });
				return;
			}

			// Always return same message to prevent user enumeration
			const successMsg = "If an account with that email exists, a reset link has been sent.";

			const is_user = await userService.exists(email);
			if (!is_user) {
				res.json({ message: successMsg, result: null, success: true });
				return;
			}

			const token = helpers.GenerateToken();
			await Cache.cache.set(`${RESET_TOKEN_PREFIX}${email}`, token, { EX: RESET_TOKEN_TTL });

			const resetUrl = `${__CONFIG__.APP.APP_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
			await emailSvc.SendMail({
				to: email,
				subject: "Reset Your Password",
				html: `
					<p>Hello,</p>
					<p>You have requested to reset your password. Click the link below to set a new password:</p>
					<p><a href="${resetUrl}">Reset Password</a></p>
					<p>This link expires in 15 minutes. If you did not request this, please ignore this email.</p>
					<p>Thank you,</p>
					<p>The Pinglet Team - Powered by ENJOYS</p>
				`,
			});

			res.json({ message: successMsg, result: null, success: true });
		} catch (error: any) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	}

	async Login(req: Request, res: Response) {
		try {
			const is_user = await userService.getUserBy({
				where: {
					email: req.body.email,
				},
				select: {
					id: true,
					email: true,
					first_name: true,
					last_name: true,
					password: true,
				},
			});
			if (!is_user) {
				throw new Error("Invalid Credentials");
			}
			const isMatch = await utils.ComparePassword(
				is_user.password,
				req.body.password,
			);
			if (!isMatch) {
				throw new Error("Invalid Credentials");
			}
			const tokenBody = {
				id: is_user.id,
				email: req.body.email,
			};
			const exp = 1000 * 60 * 60 * 24 * 30;
			const signJWT = utils.signJWT(tokenBody, is_user.id.toString(), "30d");
			res.cookie("access_token", signJWT, {
				httpOnly: true,
				maxAge: exp, // 30 day
				secure: __CONFIG__.APP.APP_ENV !== "DEV",
				sameSite: __CONFIG__.APP.APP_ENV === "DEV" ? "lax" : "strict",
				expires: new Date(Date.now() + exp),
			});

			res
				.json({
					message: "Logged In",
					result: {
						id: tokenBody.id,
						email: is_user.email,
						first_name: is_user.first_name,
						last_name: is_user.last_name,
					},
					success: true,
				})
				.end();
		} catch (error: any) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	}
	async Register(req: Request, res: Response) {
		try {
			const is_user = await userService.exists(req.body.email);
			if (is_user) {
				throw new Error("Email already exists");
			}
			const createUser = await userService.createUser({
				email: req.body.email,
				password: await utils.HashPassword(req.body.password),
			});
			const tokenBody = {
				id: createUser.id,
				email: req.body.email,
			};
			const exp = 1000 * 60 * 60 * 24 * 30;
			const signJWT = utils.signJWT(tokenBody, createUser.id.toString(), "30d");
			res.cookie("access_token", signJWT, {
				httpOnly: true,
				maxAge: exp, // 30 day
				secure: __CONFIG__.APP.APP_ENV !== "DEV",
				sameSite: __CONFIG__.APP.APP_ENV === "DEV" ? "lax" : "strict",
				expires: new Date(Date.now() + exp),
			});

			res
				.json({
					message: "Logged In",
					result: {
						id: tokenBody.id,
						email: createUser.email,
						first_name: createUser.first_name || null,
						last_name: createUser.last_name || null,
					},
					success: true,
				})
				.end();
		} catch (error: any) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	}
	async GoogleLogin(req: Request, res: Response) {
		try {
			const is_user = await userService.getUserBy({
				where: {
					email: req.body.email,
				},
				select: {
					id: true,
					email: true,
					first_name: true,
					last_name: true,
					password: true,
				},
			});
			if (!is_user) {
				res
					.json({
						message: "Initiate Login",
						result: {
							redirect_uri: provider.getAuthUrl(),
						},
						success: false,
					})
					.end();
				return;
			}
			const tokenBody = {
				id: is_user.id,
				email: req.body.email,
			};
			const exp = 1000 * 60 * 60 * 24 * 30;
			const signJWT = utils.signJWT(tokenBody, is_user.id.toString(), "30d");
			res.cookie("access_token", signJWT, {
				httpOnly: true,
				maxAge: exp, // 30 day
				secure: __CONFIG__.APP.APP_ENV !== "DEV",
				sameSite: __CONFIG__.APP.APP_ENV === "DEV" ? "lax" : "strict",
				expires: new Date(Date.now() + exp),
			});

			res
				.json({
					message: "Logged In",
					result: {
						id: tokenBody.id,
						email: is_user.email,
						first_name: is_user.first_name,
						last_name: is_user.last_name,
					},
					success: true,
				})
				.end();
		} catch (error: any) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	}
	async Callback(req: Request, res: Response) {
		try {
			const code = req.query?.code;
			if (!code) {
				throw new Error("Auth Code not found");
			}
			const token = await provider.handleCallback<GoogleAuthProviderResponse>(
				code as string,
			);
			const decodedToken = utils.decodeToken(token.access_token) as ID_TOKEN;
			const is_user = await userService.findUser(decodedToken.email);
			const tokenBody = {
				id: 0,
				email: decodedToken.email,
			};
			if (is_user) {
				tokenBody.id = is_user.id;
			} else {
				const user = await userService.createUser({
					first_name: decodedToken.name,
					last_name: decodedToken.family_name || decodedToken.given_name,
					email: decodedToken.email,
					password: await utils.HashPassword(decodedToken.sub),
				});
				tokenBody.id = user.id;
			}

			const exp = 1000 * 60 * 60 * 24 * 30;
			const signJWT = utils.signJWT(tokenBody, tokenBody.id.toString(), "30d");
			res.cookie("access_token", signJWT, {
				httpOnly: true,
				maxAge: exp, // 30 day
				secure: __CONFIG__.APP.APP_ENV !== "DEV",
				sameSite: __CONFIG__.APP.APP_ENV === "DEV" ? "lax" : "strict",
				expires: new Date(Date.now() + exp),
			});
			res
				.json({
					message: "OK",
					result: {
						id: tokenBody.id,
						email: decodedToken.email,
						first_name: decodedToken.name,
						last_name: decodedToken.family_name || decodedToken.given_name,
					},
					success: true,
				})
				.end();
		} catch (error: any) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	}
	async Logout(req: Request, res: Response) {
		try {
			res.clearCookie("access_token");
			res
				.json({
					message: "OK",
					result: null,
					success: true,
				})
				.end();
		} catch (error: any) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	}
}

export default new AuthController();
