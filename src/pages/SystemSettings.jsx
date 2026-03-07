import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Settings, Save, ArrowLeft, Loader2, Users, UserPlus } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SystemSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Settings State
    const [formData, setFormData] = useState({
        heroDescription: "",
        phoneNumber: "",
        facebookUrl: "",
    });

    // Add User State
    const [userLoading, setUserLoading] = useState(false);
    const [newUser, setNewUser] = useState({
        username: "",
        password: "",
        type: "admin", // Default role
    });

    const { toast } = useToast();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}api/settings`
            );
            if (response.data) {
                setFormData({
                    heroDescription: response.data.heroDescription || "",
                    phoneNumber: response.data.phoneNumber || "",
                    facebookUrl: response.data.facebookUrl || "",
                });
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast({
                title: "خطأ",
                description: "فشل تحميل الإعدادات",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}api/settings`, formData, {
                withCredentials: true,
            });
            toast({
                title: "تم الحفظ",
                description: "تم تحديث إعدادات النظام بنجاح",
                className: "bg-green-100 text-green-800",
            });
        } catch (error) {
            console.error("Error saving settings:", error);
            toast({
                title: "خطأ",
                description: "فشل حفظ التغييرات",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setUserLoading(true);

        if (!newUser.username || !newUser.password) {
            toast({
                title: "تنبيه",
                description: "يرجى إدخال اسم المستخدم وكلمة المرور",
                variant: "destructive",
            });
            setUserLoading(false);
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}api/user/add`, newUser, {
                withCredentials: true,
            });
            toast({
                title: "تم النجاح",
                description: "تم إضافة المستخدم بنجاح",
                className: "bg-green-100 text-green-800",
            });
            setNewUser({ username: "", password: "", type: "admin" }); // Reset form
        } catch (error) {
            console.error("Error adding user:", error);
            toast({
                title: "خطأ",
                description: error.response?.data?.message || "فشل إضافة المستخدم",
                variant: "destructive",
            });
        } finally {
            setUserLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
            dir="rtl"
        >
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 space-x-reverse">
                            <Link
                                to="/"
                                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 ml-2" />
                                العودة للرئيسية
                            </Link>
                            <div className="w-px h-6 bg-gray-300"></div>
                            <div className="flex items-center space-x-3 space-x-reverse">
                                <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-2 rounded-lg">
                                    <Settings className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">
                                        إعدادات النظام
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        تخصيص محتوى الموقع ومعلومات التواصل
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs defaultValue="settings" className="w-full" dir="rtl">
                    <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-black/5">
                        <TabsTrigger value="settings" className="flex items-center gap-2 text-base">
                            <Settings className="w-4 h-4" />
                            الإعدادات العامة
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex items-center gap-2 text-base">
                            <Users className="w-4 h-4" />
                            إدارة المستخدمين
                        </TabsTrigger>
                    </TabsList>

                    {/* Settings Tab */}
                    <TabsContent value="settings">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    تعديل المعلومات العامة
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    هذه المعلومات ستظهر للعملاء في الموقع الرئيسي
                                </p>
                            </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 block">
                                        وصف الصفحة الرئيسية (Hero Section)
                                    </label>
                                    <Textarea
                                        value={formData.heroDescription}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                heroDescription: e.target.value,
                                            })
                                        }
                                        placeholder="اكتب الوصف الذي سيظهر في واجهة الموقع..."
                                        className="h-32 resize-none"
                                        dir="rtl"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        هذا النص سيظهر بشكل بارز في الصفحة الرئيسية.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 block">
                                            رقم الهاتف
                                        </label>
                                        <Input
                                            type="text"
                                            value={formData.phoneNumber}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    phoneNumber: e.target.value,
                                                })
                                            }
                                            placeholder="+201xxxxxxxxx"
                                            dir="ltr"
                                            className="text-right"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 block">
                                            رابط الفيسبوك
                                        </label>
                                        <Input
                                            type="url"
                                            value={formData.facebookUrl}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    facebookUrl: e.target.value,
                                                })
                                            }
                                            placeholder="https://facebook.com/..."
                                            dir="ltr"
                                            className="text-right"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-slate-800 hover:bg-slate-900 text-white min-w-[120px]"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin ml-2" />
                                                جاري الحفظ...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 ml-2" />
                                                حفظ التغييرات
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </TabsContent>

            {/* Users Management Tab */}
            <TabsContent value="users">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-slate-700" />
                            إضافة مستخدم جديد
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            يمكنك إضافة لوحة تحكم فرعية (Admin) لمتابعة الطلبات فقط أو (Superadmin) للتحكم الكامل.
                        </p>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleAddUser} className="space-y-6 max-w-2xl mx-auto">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">
                                    اسم المستخدم
                                </label>
                                <Input
                                    type="text"
                                    value={newUser.username}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, username: e.target.value })
                                    }
                                    placeholder="ادخل اسم المستخدم للدخول"
                                    className="text-right"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">
                                    كلمة المرور
                                </label>
                                <Input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, password: e.target.value })
                                    }
                                    placeholder="••••••••"
                                    required
                                    className="text-right"
                                    dir="ltr"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">
                                    الدور (الصلاحيات)
                                </label>
                                <select
                                    value={newUser.type}
                                    onChange={(e) => setNewUser({ ...newUser, type: e.target.value })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    <option value="admin">مدير فرعي (Admin) - الطلبات فقط</option>
                                    <option value="superadmin">مدير عام (Superadmin) - تحكم كامل</option>
                                </select>
                            </div>

                            <div className="pt-6 border-t flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={userLoading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                                >
                                    {userLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin ml-2" />
                                            جاري الإضافة...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="h-4 w-4 ml-2" />
                                            إضافة المستخدم
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    </main>
</div>
    );
};

export default SystemSettings;
