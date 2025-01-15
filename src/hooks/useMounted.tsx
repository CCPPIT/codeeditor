"use client"; // تحديد أن هذا الملف يستخدم في جانب العميل (Client-side)

import { useEffect, useState } from 'react'; // استيراد useEffect و useState من مكتبة React

// تعريف هوك مخصص للتحقق مما إذا كان المكون مركبًا
const useMounted = () => {
    // حالة لتتبع ما إذا كان المكون مركبًا
    const [mounted, setMounted] = useState(false);

    // استخدام useEffect لتغيير حالة mounted عند تركيب المكون
    useEffect(() => {
        setMounted(true); // تعيين mounted إلى true عند تركيب المكون
    }, []); // مصفوفة الفحص الفارغة تعني أن التأثير سيتم تنفيذه مرة واحدة فقط عند التركيب

    return mounted; // إرجاع حالة mounted
};

export default useMounted; // تصدير الهوك للاستخدام في مكونات أخرى