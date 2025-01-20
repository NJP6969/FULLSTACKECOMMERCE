import {create} from "zustand";
import { deleteProduct } from "../../../backend/controllers/product.controller";

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({products}), //local vs global state
    createProduct: async (newProduct) => {
        if (!newProduct.name || !newProduct.price || !newProduct.Description || !newProduct.Category) {
            return console.log('All fields are required');
        }
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newProduct),
            });
            const data = await res.json();
            if (data.success) {
                set((state) => ({ products: [...state.products, data.data] }));
                return { success: true, data: data.data };
            }
        } catch (error) {
            console.log('Error creating product:', error);
            return { success: false };
        }
    },
      
    getProducts: async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            console.log(data);
            set({ products: data.data });
        } catch (error) {
            console.log('Error getting products:', error);
        }
    },  
    deleteProduct: async (id) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (!data.success) {
                alert(data.message);
                return { success: false };
            }
            set((state) => ({
                products: state.products.filter((product) => product._id !== id),
            }));
            return { success: true };
        } catch (error) {
            console.log('Error deleting product:', error);
            return { success: false };
        }
    }
}))

    
