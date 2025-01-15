import { httpRouter } from "convex/server"; // استيراد httpRouter من مكتبة Convex
import { httpAction } from "./_generated/server"; // استيراد httpAction من المسار الناتج
import { Webhook } from "svix"; // استيراد Webhook من مكتبة Svix
import { WebhookEvent } from "@clerk/nextjs/server"; // استيراد WebhookEvent من Clerk
import { api } from "./_generated/api"; // استيراد api من المسار الناتج

// إنشاء مثيل من httpRouter
const http = httpRouter();

// تعريف مسار webhook
http.route({
    path: "/clerk-webhook", // مسار webhook
    method: "POST", // طريقة HTTP المستخدمة
    handler: httpAction(async (ctx, request) => {
        // الحصول على السر الخاص بـ Clerk من المتغيرات البيئية
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
        }

        // الحصول على رؤوس الطلب
        const svix_id = request.headers.get("svix-id");
        const svix_signature = request.headers.get("svix-signature");
        const svix_timestamp = request.headers.get("svix-timestamp");

        // التحقق من وجود جميع رؤوس SVIX المطلوبة
        if (!svix_id || !svix_signature || !svix_timestamp) {
            return new Response("Error occurred -- on svix headers", { status: 400 });
        }

        // قراءة جسم الطلب كـ JSON
        const payload = await request.json();
        const body = JSON.stringify(payload); // تحويل الجسم إلى سلسلة نصية
        const wh = new Webhook(webhookSecret); // إنشاء مثيل Webhook مع السر

        let evt: WebhookEvent; // تعريف متغير evt من نوع WebhookEvent
        try {
            // التحقق من صحة الحدث الوارد
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature
            }) as WebhookEvent;

        } catch (err) {
            console.log("Error verifying webhook:", err); // تسجيل الخطأ في التحقق
            return new Response("Error occurred", { status: 400 });
        }

        // الحصول على نوع الحدث
        const eventType = evt.type;
        if (eventType === "user.created") { // إذا كان الحدث هو إنشاء مستخدم
            const { id, email_addresses, first_name, last_name } = evt.data;
            const email = email_addresses[0].email_address; // الحصول على البريد الإلكتروني
            const name = `${first_name || ""} ${last_name || ""}`.trim(); // تجميع الاسم

            try {
                // استدعاء دالة التزامن لإضافة المستخدم
                await ctx.runMutation(api.users.syncUser, {
                    userId: id,
                    email,
                    name
                });

            } catch (error) {
                console.log("Error creating user:", error); // تسجيل الخطأ عند إنشاء المستخدم
                return new Response("Error creating user", { status: 400 });
            }
        }

        // إرجاع استجابة ناجحة بعد معالجة webhook
        return new Response("Webhook processed successfully", { status: 200 });
    })
});

// تصدير مثيل http
export default http;