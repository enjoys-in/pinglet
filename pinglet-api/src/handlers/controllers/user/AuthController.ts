import { __CONFIG__ } from "@/app/config";
import { AuthProviderFactory } from "@/app/modules/oauth2/oauth2factory";
import { userService } from "@/handlers/services/users.service";
import utils from "@/utils";
import type {
	GoogleAuthProviderResponse,
	ID_TOKEN,
} from "@/utils/interfaces/provider.interface";
import type { Request, Response } from "express";

const provider = AuthProviderFactory.createProvider(
	"google",
	"dd",
	"ss",
	"http://localhost",
);

class AuthController {
	async Login(req: Request, res: Response) {
		try {
			const is_user = await userService.findUser(req.body.email);
			if (!is_user) {
				throw new Error("Invalid Credentials");

			}
			const isMatch = await utils.ComparePassword(
				is_user.password,
				req.body.password
			)
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
				secure: __CONFIG__.APP.APP_ENV === "DEV"?false:true,
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
			const is_user = await userService.findUser(req.body.email);
			if (is_user) {
				throw new Error("Email already exists");

			}
			const createUser = await userService.createUser({
				email: req.body.email,
				password: await utils.HashPassword(req.body.password),
			})
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
			const is_user = await userService.findUser(req.body.email);
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
					success: false,
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
