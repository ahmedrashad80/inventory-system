import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useCategories = () => {
    const queryClient = useQueryClient();

    // جلب كل الأقسام (مع خيار جلب النشطة فقط)
    const { data: categories, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}api/categories`);
            return response.data;
        },
    });

    // جلب الأقسام النشطة فقط (للاستخدام في المتجر الإلكتروني)
    const { data: activeCategories, isLoading: isLoadingActive } = useQuery({
        queryKey: ["categories", "active"],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}api/categories?activeOnly=true`);
            return response.data;
        },
    });

    // إنشاء قسم جديد
    const addCategory = useMutation({
        mutationFn: (newCategory) => {
            return axios.post(`${API_URL}api/categories`, newCategory, {
                headers: { "Content-Type": "application/json" },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["categories"]);
        },
    });

    // تحديث قسم
    const updateCategory = useMutation({
        mutationFn: ({ id, data }) => {
            return axios.put(`${API_URL}api/categories/${id}`, data, {
                headers: { "Content-Type": "application/json" },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["categories"]);
        },
    });

    // حذف قسم
    const deleteCategory = useMutation({
        mutationFn: (id) => axios.delete(`${API_URL}api/categories/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(["categories"]);
        },
    });

    return {
        categories,
        activeCategories,
        isLoading,
        isLoadingActive,
        addCategory,
        updateCategory,
        deleteCategory,
    };
};
