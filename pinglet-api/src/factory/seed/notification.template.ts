// notificationTemplates.js

export const notificationTemplates = {
	payment: [
		{
			id: "payment_received",
			title: "Payment Received",
			description: "You’ve received ₹{amount} from {user}.",
			media: { type: "icon", src: "icons/payment.png" },
		},
		{
			id: "payment_failed",
			title: "Payment Failed",
			description: "Transaction failed for {product}. Try again.",
			media: { type: "icon", src: "icons/failure.png" },
		},
		{
			id: "refund_issued",
			title: "Refund Processed",
			description: "Refund of ₹{amount} sent to {user}.",
			media: { type: "icon", src: "icons/refund.png" },
		},
		{
			id: "subscription_renewed",
			title: "Subscription Renewed",
			description: "{user} renewed their plan.",
			media: { type: "icon", src: "icons/renew.png" },
		},
		{
			id: "subscription_canceled",
			title: "Subscription Canceled",
			description: "{user} canceled their subscription.",
			media: { type: "icon", src: "icons/cancel.png" },
		},
		{
			id: "invoice_sent",
			title: "Invoice Sent",
			description: "Invoice #{invoiceId} sent to {user}.",
			media: { type: "icon", src: "icons/invoice.png" },
		},
		{
			id: "payment_reminder",
			title: "Payment Reminder",
			description: "Reminder: ₹{amount} due for invoice #{invoiceId}.",
			media: { type: "icon", src: "icons/reminder.png" },
		},
	],

	order: [
		{
			id: "order_placed",
			title: "Order Placed",
			description: "{user} just ordered {product}.",
			media: { type: "image", src: "images/order.png" },
		},
		{
			id: "order_shipped",
			title: "Order Shipped",
			description: "Your order #{orderId} is on the way!",
			media: { type: "icon", src: "icons/shipped.png" },
		},
		{
			id: "order_delivered",
			title: "Order Delivered",
			description: "Your package #{orderId} was delivered to {address}.",
			media: { type: "icon", src: "icons/delivered.png" },
		},
		{
			id: "order_cancelled",
			title: "Order Cancelled",
			description: "Order #{orderId} was cancelled by {user}.",
			media: { type: "icon", src: "icons/cancelled.png" },
		},
		{
			id: "order_return_requested",
			title: "Return Requested",
			description: "{user} requested a return for #{orderId}.",
			media: { type: "icon", src: "icons/return.png" },
		},
		{
			id: "order_refund_issued",
			title: "Order Refund Issued",
			description: "Refund issued for order #{orderId} to {user}.",
			media: { type: "icon", src: "icons/refund.png" },
		},
	],

	user: [
		{
			id: "user_signup",
			title: "New Signup",
			description: "{user} just signed up.",
			media: { type: "icon", src: "icons/signup.png" },
		},
		{
			id: "user_login",
			title: "User Logged In",
			description: "{user} logged in from {device}.",
			media: { type: "icon", src: "icons/login.png" },
		},
		{
			id: "profile_update",
			title: "Profile Updated",
			description: "{user} updated their profile details.",
			media: { type: "icon", src: "icons/profile.png" },
		},
		{
			id: "waitlist_join",
			title: "Joined Waitlist",
			description: "{user} joined the waitlist for {product}.",
			media: { type: "icon", src: "icons/waitlist.png" },
		},
		{
			id: "account_deleted",
			title: "Account Deleted",
			description: "{user} has deleted their account.",
			media: { type: "icon", src: "icons/delete.png" },
		},
		{
			id: "user_verified",
			title: "User Verified",
			description: "{user} verified their email.",
			media: { type: "icon", src: "icons/verified.png" },
		},
	],

	marketing: [
		{
			id: "sale_live",
			title: "Flash Sale Started",
			description: "⚡ {saleName} is now live! {discount}% off on all items.",
			media: { type: "image", src: "images/sale.png" },
		},
		{
			id: "cart_abandoned",
			title: "Items Left in Cart",
			description:
				"{user}, your cart is waiting! {itemsCount} items left behind.",
			media: { type: "image", src: "images/cart.png" },
		},
		{
			id: "new_campaign",
			title: "New Campaign Launched",
			description:
				"Campaign '{campaign}' is now active. Track your performance!",
			media: { type: "icon", src: "icons/campaign.png" },
		},
		{
			id: "newsletter_subscribed",
			title: "Newsletter Subscribed",
			description: "{user} subscribed to your newsletter.",
			media: { type: "icon", src: "icons/newsletter.png" },
		},
	],

	countdown: [
		{
			id: "trial_ending",
			title: "Trial Ending Soon",
			description: "Your trial ends in {days} days. Upgrade now!",
			media: { type: "icon", src: "icons/trial.png" },
		},
		{
			id: "offer_expiry",
			title: "Offer Ending Soon",
			description: "⏳ Only {minutes} minutes left on your deal.",
			media: { type: "icon", src: "icons/clock.png" },
		},
		{
			id: "event_reminder",
			title: "Event Reminder",
			description: "{event} starts in {time}.",
			media: { type: "icon", src: "icons/event.png" },
		},
	],

	delivery: [
		{
			id: "rider_assigned",
			title: "Delivery Rider Assigned",
			description: "{riderName} is on the way to deliver your food.",
			media: { type: "icon", src: "icons/rider.png" },
		},
		{
			id: "food_prepared",
			title: "Food Ready",
			description: "Your order from {restaurant} is ready for pickup!",
			media: { type: "icon", src: "icons/food.png" },
		},
		{
			id: "food_delivered",
			title: "Order Delivered",
			description: "Enjoy your meal! Your order was delivered successfully.",
			media: { type: "icon", src: "icons/delivered.png" },
		},
	],

	agency: [
		{
			id: "client_signed",
			title: "New Client Signed",
			description: "{client} signed a new contract with your agency.",
			media: { type: "icon", src: "icons/client.png" },
		},
		{
			id: "analytics_report_ready",
			title: "Analytics Report Ready",
			description: "Your monthly analytics report for {month} is available.",
			media: { type: "icon", src: "icons/report.png" },
		},
	],

	system: [
		{
			id: "system_update",
			title: "System Update Released",
			description: "Version {version} is now live with new features.",
			media: { type: "icon", src: "icons/update.png" },
		},
		{
			id: "maintenance_alert",
			title: "Planned Maintenance",
			description: "System will be offline on {date} from {start} to {end}.",
			media: { type: "icon", src: "icons/maintenance.png" },
		},
	],

	healthcare: [
		{
			id: "appointment_booked",
			title: "Appointment Confirmed",
			description:
				"You’ve booked an appointment with Dr. {doctor} on {date} at {time}.",
			media: { type: "icon", src: "icons/appointment.png" },
		},
		{
			id: "lab_results_ready",
			title: "Lab Results Ready",
			description: "Your lab results for {test} are now available.",
			media: { type: "icon", src: "icons/lab.png" },
		},
	],

	edtech: [
		{
			id: "course_enrolled",
			title: "Course Enrollment Successful",
			description: "You are now enrolled in {courseName}.",
			media: { type: "icon", src: "icons/course.png" },
		},
		{
			id: "assignment_due",
			title: "Assignment Due Soon",
			description: "Your assignment for {course} is due in {hours} hours.",
			media: { type: "icon", src: "icons/assignment.png" },
		},
	],

	team: [
		{
			id: "task_assigned",
			title: "New Task Assigned",
			description: "{assignee}, you've been assigned: {taskName}.",
			media: { type: "icon", src: "icons/task.png" },
		},
		{
			id: "project_invite",
			title: "Added to Project",
			description: "You were added to project: {projectName} by {inviter}.",
			media: { type: "icon", src: "icons/project.png" },
		},
	],

	announcement: [
		{
			id: "new_feature",
			title: "New Feature Launched",
			description: "{featureName} is now available for all users!",
			media: { type: "icon", src: "icons/feature.png" },
		},
		{
			id: "milestone_reached",
			title: "Milestone Achieved",
			description: "You’ve hit {milestone} users! 🎉",
			media: { type: "icon", src: "icons/milestone.png" },
		},
	],
};

export function renderTemplate(template: any, data: Record<string, any> = {}) {
	/**
	 * Replaces placeholders in a string with the corresponding values from the data object.
	 *
	 * @param {string} str - The string to interpolate.
	 * @returns {string} The interpolated string.
	 *
	 * @example
	 *   const data = { name: 'John', age: 25 };
	 *   const str = "My name is {name} and I'm {age} years old.";
	 *   const interpolated = interpolate(str, data);
	 *   console.log(interpolated); // My name is John and I'm 25 years old.
	 */
	const interpolate = (str: string) =>
		str.replace(/\{(.*?)\}/g, (_, key) => data[key] ?? `{${key}}`);

	return {
		title: interpolate(template.title),
		description: interpolate(template.description),
		media: template.media,
	};
}

// Usage Example:
// const t = getTemplate('payment', 'payment_received');
// const rendered = renderTemplate(t, { user: 'John', amount: '499' });
// => { title: 'Payment Received', description: 'You’ve received ₹499 from John.', media: {...} }
