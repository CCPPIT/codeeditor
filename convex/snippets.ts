// استيراد المكتبات اللازمة من Convex
import { ConvexError, v } from "convex/values"; // ConvexError تُستخدم لرمي الأخطاء، و v تُستخدم لتعريف الأنواع
import { mutation, query } from "./_generated/server"; // استيراد الدالة mutation من ملف توليد الخادم

// تعريف دالة لإنشاء مقتطفات كود جديدة باستخدام mutation
export const createSnippet = mutation({
    // تعريف المعاملات التي ستستقبلها الدالة
    args: {
        title: v.string(), // عنوان المقتطف يجب أن يكون من نوع سلسلة نصية
        language: v.string(), // اللغة المستخدمة يجب أن تكون من نوع سلسلة نصية
        code: v.string(), // الكود نفسه يجب أن يكون من نوع سلسلة نصية
    },
    // الدالة التي ستتعامل مع البيانات المستلمة
    handler: async (ctx, args) => {
        // الحصول على هوية المستخدم الحالي
        const identity = await ctx.auth.getUserIdentity();
        
        // إذا لم يكن هناك هوية، رمي خطأ
        if (!identity) throw new ConvexError("Not authenticated");

        // استعلام قاعدة البيانات للبحث عن المستخدم
        const user = await ctx.db
            .query("users") // استعلام عن جدول المستخدمين
            .withIndex("by_user_id") // استخدام الفهرس للبحث عن المستخدم وفقًا لمعرفه
            .filter((q) => q.eq(q.field("userId"), identity.subject)) // تصفية المستخدم بناءً على userId
            .first(); // الحصول على أول نتيجة فقط

        // إذا لم يتم العثور على المستخدم، رمي خطأ
        if (!user) throw new Error("User not found");

        // إدخال المقتطف الجديد في جدول 'snippets' في قاعدة البيانات
        const snippetId = await ctx.db.insert("snippets", {
            userId: identity.subject, // معرف المستخدم
            userName: user.name, // اسم المستخدم
            title: args.title, // عنوان المقتطف
            language: args.language, // اللغة المستخدمة
            code: args.code // الكود نفسه
        });

        // إرجاع معرف المقتطف الجديد
        return snippetId;
    }
});




// تعريف استعلام للحصول على المقتطفات
export const getSnippets = query({
    // الدالة التي ستتعامل مع الاستعلام
    handler: async (ctx) => {
        // استعلام قاعدة البيانات للحصول على جميع المقتطفات
        const snippets = await ctx.db.query("snippets") // استعلام عن جدول المقتطفات
            .order("desc") // ترتيب النتائج بترتيب تنازلي
            .collect(); // جمع النتائج في مصفوفة

        // إرجاع المقتطفات
        return snippets;
    }
});
// تعريف استعلام للحصول على مقتطف كود بناءً على معرفه
export const getSnippetById = query({
    // تعريف المعاملات التي ستستقبلها الدالة
    args: {
        snippetId: v.id("snippets") // تعريف المعامل 'snippetId' كمعرف من نوع 'snippets'
    },
    // الدالة التي ستتعامل مع الاستعلام
    handler: async (ctx, args) => {
        // استعلام قاعدة البيانات للحصول على المقتطف بناءً على المعرف
        const snippet = await ctx.db.get(args.snippetId);

        // التحقق مما إذا كان المقتطف موجودًا
        if (!snippet) throw new Error("Snippet not found"); // إذا لم يتم العثور على المقتطف، رمي خطأ

        // إرجاع المقتطف
        return snippet; // إرجاع المقتطف الموجود
    }
});


// تعريف عملية حذف مقتطف
export const deleteSnippet = mutation({
    // تعريف المعاملات التي تستقبلها الدالة
    args: { snippetId: v.id("snippets") },
    // الدالة التي ستتعامل مع عملية الحذف
    handler: async (ctx, args) => {
        // الحصول على هوية المستخدم
        const identity = await ctx.auth.getUserIdentity();
        // التحقق مما إذا كان المستخدم قد قام بتسجيل الدخول
        if (!identity) throw new Error("Not authenticated");

        // استعلام قاعدة البيانات للحصول على المقتطف بناءً على المعرف
        const snippet = await ctx.db.get(args.snippetId);
        // التحقق مما إذا كان المقتطف موجودًا
        if (!snippet) throw new Error("Snippet not found");
        // التحقق من أن المستخدم هو مالك المقتطف
        if (snippet.userId !== identity.subject) {
            throw new Error("Not authorized to delete this snippet");
        }

        // حذف التعليقات المرتبطة بالمقتطف
        const comments = await ctx.db.query("snippetComments")
            .withIndex("by_snippet_id")
            .filter((q) => q.eq(q.field("snippetId"), args.snippetId))
            .collect();

        // حذف كل تعليق مرتبط بالمقتطف
        for (const comment of comments) {
            await ctx.db.delete(comment._id);
        }

        // حذف النجوم المرتبطة بالمقتطف
        const stars = await ctx.db.query("stars")
            .withIndex("by_snippet_id")
            .filter((q) => q.eq(q.field("snippetId"), args.snippetId))
            .collect();

        // حذف كل نجمة مرتبطة بالمقتطف
        for (const star of stars) {
            await ctx.db.delete(star._id);
        }

        // حذف المقتطف نفسه
        await ctx.db.delete(args.snippetId);
    }
});
// تعريف عملية إضافة أو إزالة نجمة من المقتطف
export const starsnippet = mutation({
    // تعريف المعاملات التي تستقبلها الدالة
    args: { snippetId: v.id("snippets") },
    // الدالة التي ستتعامل مع عملية النجمة
    handler: async (ctx, args) => {
        // الحصول على هوية المستخدم
        const identity = await ctx.auth.getUserIdentity();
        // التحقق مما إذا كان المستخدم قد قام بتسجيل الدخول
        if (!identity) throw new Error("Not authenticated");

        // استعلام قاعدة البيانات للتحقق مما إذا كانت النجمة موجودة
        const existing = await ctx.db.query("stars")
            .withIndex("by_user_id_and_snippet_id")
            .filter((q) => q.eq(q.field("userId"), identity.subject) && q.eq(q.field("snippetId"), args.snippetId))
            .first();

        // إذا كانت النجمة موجودة، قم بحذفها
        if (existing) {
            await ctx.db.delete(existing._id);
        } else {
            // إذا لم تكن النجمة موجودة، قم بإضافتها
            await ctx.db.insert("stars", {
                userId: identity.subject,
                snippetId: args.snippetId
            });
        }
    }
});

// تعريف عملية إضافة تعليق
export const addComment = mutation({
    // تعريف المعاملات التي تستقبلها الدالة
    args: {
        snippetId: v.id("snippets"), // معرف المقتطف
        content: v.string(), // محتوى التعليق
    },
    // الدالة التي ستتعامل مع عملية إضافة التعليق
    handler: async (ctx, args) => {
        // الحصول على هوية المستخدم
        const identity = await ctx.auth.getUserIdentity();
        // التحقق مما إذا كان المستخدم قد قام بتسجيل الدخول
        if (!identity) throw new Error("Not authenticated");

        // استعلام قاعدة البيانات للحصول على معلومات المستخدم
        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id")
            .filter((q) => q.eq(q.field("userId"), identity.subject))
            .first();

        // التحقق مما إذا كان المستخدم موجودًا
        if (!user) throw new Error("User not found");

        // إدراج التعليق في قاعدة البيانات
        return await ctx.db.insert("snippetComments", {
            snippetId: args.snippetId,
            userId: identity.subject,
            content: args.content,
            userName: user.name
        });
    }
});
// تعريف عملية حذف تعليق
export const deleteComment = mutation({
    // تعريف المعاملات التي تستقبلها الدالة
    args: {
        commentId: v.id("snippetComments") // معرف التعليق
    },
    // الدالة التي ستتعامل مع عملية حذف التعليق
    handler: async (ctx, args) => {
        // الحصول على هوية المستخدم
        const identity = await ctx.auth.getUserIdentity();
        // التحقق مما إذا كان المستخدم قد قام بتسجيل الدخول
        if (!identity) throw new Error("Not authenticated");

        // استعلام قاعدة البيانات للحصول على التعليق
        const comment = await ctx.db.get(args.commentId);
        // التحقق مما إذا كان التعليق موجودًا
        if (!comment) throw new Error("Comment not found");

        // التحقق من أن المستخدم هو مالك التعليق
        if (comment.userId !== identity.subject) {
            throw new Error("Not authorized to delete this comment");
        }

        // حذف التعليق من قاعدة البيانات
        await ctx.db.delete(args.commentId);
    }
});
// تعريف عملية الحصول على التعليقات
export const getComments = query({
    // تعريف المعاملات التي تستقبلها الدالة
    args: { snippetId: v.id("snippets") }, // معرف المقتطف
    // الدالة التي ستتعامل مع عملية الحصول على التعليقات
    handler: async (ctx, args) => {
        // الحصول على هوية المستخدم
        const identity = await ctx.auth.getUserIdentity();
        // التحقق مما إذا كان المستخدم قد قام بتسجيل الدخول
        if (!identity) throw new Error("Not authenticated");

        // استعلام قاعدة البيانات للحصول على التعليقات المرتبطة بالمقتطف
        const comments = await ctx.db
            .query("snippetComments")
            .withIndex("by_snippet_id")
            .filter((q) => q.eq(q.field("snippetId"), args.snippetId))
            .order("desc") // ترتيب التعليقات بشكل تنازلي
            .collect();

        // إرجاع قائمة التعليقات
        return comments;
    }
});
// تعريف عملية التحقق مما إذا كان المقتطف مميزًا بنجمة
export const isSnippetStarred = query({
    // تعريف المعاملات التي تستقبلها الدالة
    args: { snippetId: v.id("snippets") },
    // الدالة التي ستتعامل مع عملية التحقق
    handler: async (ctx, args) => {
        // الحصول على هوية المستخدم
        const identity = await ctx.auth.getUserIdentity();
        // إذا لم يكن هناك هوية، يتم إرجاع false
        if (!identity) return false;

        // استعلام قاعدة البيانات للتحقق مما إذا كانت النجمة موجودة
        const star = await ctx.db
            .query("stars")
            .withIndex("by_user_id_and_snippet_id")
            .filter((q) => 
                q.eq(q.field("userId"), identity.subject) && 
                q.eq(q.field("snippetId"), args.snippetId)
            )
            .first();

        // إرجاع true إذا كانت النجمة موجودة، false إذا لم تكن موجودة
        return !!star;
    }
});
// تعريف عملية الحصول على عدد النجوم لمقتطف معين
export const getSnippetStarCount = query({
    // تعريف المعاملات التي تستقبلها الدالة
    args: {
        snippetId: v.id("snippets") // معرف المقتطف
    },
    // الدالة التي ستتعامل مع عملية الحصول على عدد النجوم
    handler: async (ctx, args) => {
        // استعلام قاعدة البيانات للحصول على النجوم المرتبطة بالمقتطف
        const stars = await ctx.db
            .query("stars")
            .withIndex("by_snippet_id")
            .filter((q) => q.eq(q.field("snippetId"), args.snippetId))
            .collect();

        // إرجاع عدد النجوم
        return stars.length;
    }
});
// تعريف عملية الحصول على المقتطفات المميزة بنجمات للمستخدم
export const getStarredSnippets = query({
    // الدالة التي ستتعامل مع عملية الحصول على المقتطفات
    handler: async (ctx) => {
        // الحصول على هوية المستخدم
        const identity = await ctx.auth.getUserIdentity();
        // إذا لم يكن هناك هوية، يتم إرجاع مصفوفة فارغة
        if (!identity) return [];

        // استعلام قاعدة البيانات للحصول على النجوم المرتبطة بالمستخدم
        const stars = await ctx.db
            .query("stars")
            .withIndex("by_user_id")
            .filter((q) => q.eq(q.field("userId"), identity.subject))
            .collect();

        // استعلام قاعدة البيانات للحصول على المقتطفات المرتبطة بالنجوم
        const snippets = await Promise.all(stars.map((star) => ctx.db.get(star.snippetId)));

        // إرجاع المقتطفات التي لم تكن فارغة
        return snippets.filter((snippet) => snippet !== null);
    }
});