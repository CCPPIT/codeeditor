import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// تصدير المخطط باستخدام defineSchema
export default defineSchema({
    // تعريف جدول المستخدمين
    users: defineTable({
        // معرف المستخدم: يمثل معرف المستخدم (قد يكون clerkId)
        userId: v.string(), // يجب أن يكون سلسلة نصية

        // البريد الإلكتروني: يمثل عنوان البريد الإلكتروني للمستخدم
        email: v.string(), // يجب أن يكون سلسلة نصية

        // الاسم: يمثل اسم المستخدم
        name: v.string(), // يجب أن يكون سلسلة نصية

        // حالة الاحترافية: يحدد ما إذا كان المستخدم محترفًا أم لا
        isPro: v.boolean(), // يجب أن يكون قيمة منطقية (صحيح أو خاطئ)

        // تاريخ الاحتراف: يمثل تاريخ بدء احتراف المستخدم (اختياري)
        proSince: v.optional(v.number()), // يمكن أن يكون رقمًا، أو غير متوفر

        // معرف العميل على LemonSqueezy: معرف العميل (اختياري)
        lemonSqueezyCustomerId: v.optional(v.string()), // يمكن أن يكون سلسلة نصية، أو غير متوفر

        // معرف الطلب على LemonSqueezy: معرف الطلب (اختياري)
        lemonSqueezyOrderId: v.optional(v.string()) // يمكن أن يكون سلسلة نصية، أو غير متوفر
    })
    // إنشاء فهرس (Index) للبحث السريع باستخدام userId
    .index("by_user_id", ["userId"]), // إنشاء فهرس على userId
    // تعريف جدول لتنفيذ الكود
codeExecutions: defineTable({
    // معرف المستخدم: يمثل المستخدم الذي قام بتنفيذ الكود
    userId: v.string(), // يجب أن يكون سلسلة نصية

    // لغة البرمجة: تمثل لغة البرمجة المستخدمة في تنفيذ الكود
    language: v.string(), // يجب أن يكون سلسلة نصية

    // الكود: يمثل الكود الذي تم تنفيذه
    code: v.string(), // يجب أن يكون سلسلة نصية

    // الناتج: يمثل الناتج الناتج عن تنفيذ الكود (اختياري)
    output: v.optional(v.string()), // يمكن أن يكون سلسلة نصية، أو غير متوفر

    // الخطأ: يمثل أي خطأ حدث أثناء تنفيذ الكود (اختياري)
    error: v.optional(v.string()), // يمكن أن يكون سلسلة نصية، أو غير متوفر
})
// إنشاء فهرس (Index) للبحث السريع باستخدام userId
.index("by_user_id", ["userId"]), // إنشاء فهرس على userId
// تعريف جدول لتخزين المقاطع البرمجية
snippets: defineTable({
    // معرف المستخدم: يمثل المستخدم الذي أنشأ المقطع البرمجي
    userId: v.string(), // يجب أن يكون سلسلة نصية

    // عنوان المقطع: يمثل عنوان المقطع البرمجي
    title: v.string(), // يجب أن يكون سلسلة نصية

    // لغة البرمجة: تمثل لغة البرمجة المستخدمة في المقطع
    language: v.string(), // يجب أن يكون سلسلة نصية

    // الكود: يمثل الكود الموجود في المقطع البرمجي
    code: v.string(), // يجب أن يكون سلسلة نصية

    // اسم المستخدم: يمثل اسم المستخدم الذي أنشأ المقطع
    userName: v.string(), // يجب أن يكون سلسلة نصية
})
// إنشاء فهرس (Index) للبحث السريع باستخدام userId
.index("by_user_id", ["userId"]), // إنشاء فهرس على userId
// تعريف جدول لتخزين تعليقات المقاطع البرمجية
snippetComments: defineTable({
    // معرف المقطع: يمثل المقطع الذي تم التعليق عليه
    snippetId: v.id("snippets"), // يجب أن يكون معرفًا مرتبطًا بجدول 'snippets'

    // معرف المستخدم: يمثل المستخدم الذي كتب التعليق
    userId: v.string(), // يجب أن يكون سلسلة نصية

    // اسم المستخدم: يمثل اسم المستخدم الذي كتب التعليق
    userName: v.string(), // يجب أن يكون سلسلة نصية

    // محتوى التعليق: يمثل نص التعليق نفسه
    content: v.string() // يجب أن يكون سلسلة نصية
})
// إنشاء فهرس (Index) للبحث السريع باستخدام snippetId
.index("by_snippet_id", ["snippetId"]), // إنشاء فهرس على snippetId
// تعريف جدول لتخزين التقييمات أو النجوم للمقاطع البرمجية
stars: defineTable({
    // معرف المستخدم: يمثل المستخدم الذي قام بتقييم المقطع
    userId: v.string(), // يجب أن يكون سلسلة نصية

    // معرف المقطع: يمثل المقطع الذي تم تقييمه
    snippetId: v.id("snippets") // يجب أن يكون معرفًا مرتبطًا بجدول 'snippets'
})
// إنشاء فهرس (Index) للبحث السريع باستخدام userId
.index("by_user_id", ["userId"]) // إنشاء فهرس على userId
// إنشاء فهرس (Index) للبحث السريع باستخدام snippetId
.index("by_snippet_id", ["snippetId"]) // إنشاء فهرس على snippetId
// إنشاء فهرس (Index) للبحث السريع باستخدام userId و snippetId
.index("by_user_id_and_snippet_id", ["userId", "snippetId"]), 
// إنشاء فهرس مركب على userId و snippetId

});
