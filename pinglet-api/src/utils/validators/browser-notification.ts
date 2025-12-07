import { z } from "zod";

// ===== NOTIFICATION ACTION SCHEMA =====

const NotificationActionSchema = z.object({
	action: z.string().min(1, "Action identifier is required"),
	title: z.string().min(1, "Action title is required"),
	icon: z.string().url("Action icon must be a valid URL").optional(),
});

// ===== NOTIFICATION DATA SCHEMA =====

const NotificationDataSchema = z.object({
	url: z.string().url("URL must be valid").optional().default("/"),
	duration: z.number().int().min(0, "Duration must be non-negative").optional(),
	userId: z.string().optional(),
	notificationId: z.string().optional(),
	metadata: z.object(z.any()).optional(),
});

// ===== MAIN NOTIFICATION PAYLOAD SCHEMA =====

const NotificationPayloadSchema = z.object({
	// Required fields
	title: z
		.string()
		.min(1, "Title is required")
		.max(100, "Title must be 100 characters or less")
		.default("Default Title"),

	// Optional basic fields
	body: z
		.string()
		.max(500, "Body must be 500 characters or less")
		.optional()
		.default("Default message body"),

	icon: z
		.string()
		.url("Icon must be a valid URL")
		.optional()
		.default("/default-icon.png"),

	badge: z.string().url("Badge must be a valid URL").optional(),

	image: z.string().url("Image must be a valid URL").optional(),

	// Notification behavior
	tag: z.string().optional().default("notification-tag"),

	requireInteraction: z.boolean().optional().default(false),

	silent: z.boolean().optional().default(false),

	renotify: z.boolean().optional().default(false),

	// Timing and interaction
	timestamp: z.number().int().positive("Timestamp must be positive").optional(),

	vibrate: z
		.union([
			z.number().int().nonnegative(),
			z.array(z.number().int().nonnegative()),
		])
		.optional(),

	// Localization
	dir: z.enum(["auto", "ltr", "rtl"]).optional().default("auto"),

	lang: z
		.string()
		.min(2, "Language code must be at least 2 characters")
		.max(5, "Language code must be 5 characters or less")
		.optional(),

	// Complex objects
	data: NotificationDataSchema.optional(),

	actions: z
		.array(NotificationActionSchema)
		.max(2, "Maximum 2 actions allowed")
		.optional()
		.default([
			{
				action: "view",
				title: "View",
			},
			{
				action: "dismiss",
				title: "Dismiss",
			},
		]),
});
// Schema for typed notifications with categories
const TypedNotificationPayloadSchema = NotificationPayloadSchema.extend({
	type: z.enum([
		"message",
		"alert",
		"reminder",
		"update",
		"social",
		"marketing",
		"system",
		"emergency",
	]),

	priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),

	category: z.string().optional(),

	groupId: z.string().optional(),
});

// Schema for notification settings
const NotificationSettingsSchema = z.object({
	enabled: z.boolean().default(true),

	//   types: z.object(z.boolean()).default({}),

	quietHours: z
		.object({
			enabled: z.boolean().default(false),
			start: z
				.string()
				.regex(
					/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
					"Invalid time format (HH:MM)",
				),
			end: z
				.string()
				.regex(
					/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
					"Invalid time format (HH:MM)",
				),
		})
		.optional(),

	sound: z.boolean().default(true),
	vibration: z.boolean().default(true),
	duration: z.number().int().min(1000).max(30000).default(5000),
});

export {
	NotificationPayloadSchema,
	TypedNotificationPayloadSchema,
	NotificationSettingsSchema,
};
