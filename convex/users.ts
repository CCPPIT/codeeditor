import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// تعريف دالة التعديل (mutation) لتزامن بيانات المستخدم
export const syncUser = mutation({
    // تعريف المعاملات المطلوبة لهذه الدالة
    args: {
        userId: v.string(), // معرف المستخدم، يجب أن يكون سلسلة نصية
        email: v.string(),  // البريد الإلكتروني، يجب أن يكون سلسلة نصية
        name: v.string(),   // الاسم، يجب أن يكون سلسلة نصية
    },
    // معالج الدالة
    handler: async (ctx, args) => {
        // استعلام للتحقق مما إذا كان المستخدم موجودًا بالفعل في قاعدة البيانات
        const existingUser = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("userId"), args.userId)) // تصفية المستخدمين حسب userId
            .first(); // الحصول على أول نتيجة

        // إذا لم يكن المستخدم موجودًا، قم بإضافته
        if (!existingUser) {
            await ctx.db.insert("users", {
                userId: args.userId, // إضافة معرف المستخدم
                email: args.email,    // إضافة البريد الإلكتروني
                name: args.name,      // إضافة الاسم
                isPro: false          // تعيين isPro إلى false افتراضيًا
            });
        }
    }
});
// تعريف استعلام لجلب معلومات المستخدم
export const getUser = query({
    // تعريف المعاملات المطلوبة للاستعلام
    args: { userId: v.string() }, // معرف المستخدم، يجب أن يكون سلسلة نصية

    // معالج الاستعلام
    handler: async (ctx, args) => {
        // التحقق مما إذا كان userId موجودًا
        if (!args.userId) return null; // إذا لم يكن موجودًا، إرجاع null

        // استعلام لجلب المستخدم من قاعدة البيانات
        const user = await ctx.db.query("users")
            .withIndex("by_user_id") // استخدام الفهرس "by_user_id"
            .filter((q) => q.eq(q.field("userId"), args.userId)) // تصفية المستخدمين حسب userId
            .first(); // الحصول على أول نتيجة فقط

        // التحقق مما إذا كان المستخدم موجودًا
        if (!user) return null; // إذا لم يكن موجودًا، إرجاع null

        // إرجاع معلومات المستخدم
        return user; // إرجاع الكائن المستخدم
    }
});