// استيراد المكتبات اللازمة من Convex
import { ConvexError, v } from "convex/values"; // ConvexError تُستخدم لرمي الأخطاء، و v تُستخدم لتعريف الأنواع
import { mutation } from "./_generated/server"; // استيراد الدالة mutation من ملف توليد الخادم

// تعريف دالة الحفظ باستخدام mutation
export const saveExecution = mutation({
    // تعريف المعاملات التي ستستقبلها الدالة
    args: {
        language: v.string(), // اللغة يجب أن تكون من نوع سلسلة نصية
        code: v.string(), // الكود يجب أن يكون من نوع سلسلة نصية
        output: v.optional(v.string()), // الإخراج خيار، ويمكن أن يكون من نوع سلسلة نصية أو غير موجود
        error: v.optional(v.string()), // الخطأ خيار، ويمكن أن يكون من نوع سلسلة نصية أو غير موجود
    },
    // الدالة التي ستتعامل مع البيانات المستلمة
    handler: async (ctx, args) => {
        // الحصول على هوية المستخدم الحالي
        const identity = await ctx.auth.getUserIdentity();
        
        // إذا لم يكن هناك هوية، رمي خطأ
        if (!identity) throw new ConvexError("Not authenticated");

        // التحقق من حالة الاشتراك Pro
        const user = await ctx.db
            .query("users") // استعلام قاعدة البيانات للبحث عن المستخدمين
            .withIndex("by_user_id") // استخدام الفهرس للبحث عن المستخدم حسب معرفه
            .filter((q) => q.eq(q.field("userId"), identity.subject)) // تصفية المستخدم بناءً على userId
            .first(); // الحصول على أول نتيجة فقط

        // إذا لم يكن المستخدم لديه اشتراك Pro واللغة ليست JavaScript، رمي خطأ
        if (!user?.isPro && args.language !== "javascript") {
            throw new ConvexError("Pro subscription required to use this language");
        }

        // إدخال البيانات في جدول 'codeExecutions' في قاعدة البيانات
        await ctx.db.insert("codeExecutions", {
            ...args, // إدراج جميع المعاملات المستلمة (language, code, output, error)
            userId: identity.subject // إضافة userId للمستخدم الحالي
        });
    }
});