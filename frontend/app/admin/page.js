"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [modalSuccess, setModalSuccess] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    status: "active",
  });

  const [images, setImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState([]);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const clearAuthData = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("loggedInExpires");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  };
  
  const redirectToLogin = () => {
    router.push(`/admin/login?next=${encodeURIComponent("/admin")}`);
  };

  // ตรวจสอบ authentication อย่างเข้มงวด
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthChecking(true);
        
        // ตรวจสอบ token และ session
        const token = localStorage.getItem("access_token");
        const loggedIn = localStorage.getItem("loggedIn");
        const expires = parseInt(localStorage.getItem("loggedInExpires") || "0", 10);
        
        // ตรวจสอบว่ามี token หรือไม่
        if (!token) {
          console.log("No access token found");
          clearAuthData();
          redirectToLogin();
          return;
        }
        
        // ตรวจสอบ session expiry
        if (loggedIn !== "true" || !expires || Date.now() >= expires) {
          console.log("Session expired");
          clearAuthData();
          redirectToLogin();
          return;
        }
        
        // ตรวจสอบ token validity โดยเรียก API /me
        try {
          const response = await fetch(`${API_URL}/me`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          
          if (!response.ok) {
            // Token ไม่ valid หรือหมดอายุ
            if (response.status === 401) {
              console.log("Token invalid or expired");
              clearAuthData();
              redirectToLogin();
              return;
            }
            throw new Error(`Authentication check failed: ${response.status}`);
          }
          
          // ตรวจสอบ role ของ user
          const userData = await response.json();
          if (!userData || userData.role !== "admin") {
            console.log("User is not an admin. Role:", userData?.role);
            alert("คุณไม่มีสิทธิ์เข้าถึงหน้า Admin กรุณาเข้าสู่ระบบด้วยบัญชี Admin");
            clearAuthData();
            redirectToLogin();
            return;
          }
          
          // Authentication สำเร็จ และเป็น admin
          setIsAuthenticated(true);
          setAuthChecking(false);
          await fetchProducts();
          
        } catch (err) {
          console.error("Error verifying token:", err);
          clearAuthData();
          redirectToLogin();
          return;
        }
        
      } catch (err) {
        console.error("Auth check error:", err);
        clearAuthData();
        redirectToLogin();
      }
    };
    
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("access_token");
      if (!token) {
        redirectToLogin();
        return;
      }

      const response = await fetch(`${API_URL}/products?limit=500`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`ไม่สามารถดึงข้อมูลสินค้าได้ (${response.status})`);
      }

      const data = await response.json();
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages((prev) => [...prev, ...files]);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setModalError("กรุณาเข้าสู่ระบบใหม่");
        redirectToLogin();
        return;
      }
      
      const uploadPromises = files.map(async (file) => {
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);

        const response = await fetch(`${API_URL}/products/upload-image`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formDataUpload,
        });

        if (!response.ok) {
          throw new Error(`Upload failed`);
        }

        const data = await response.json();
        return data.image_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedUrls]);
      setUploadingImages([]);
    } catch (err) {
      console.error("Error uploading images:", err);
      setModalError(err.message);
      setUploadingImages([]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);
    setModalSuccess(false);

    try {
      if (
        !formData.sku ||
        !formData.name ||
        !formData.price ||
        !formData.stock
      ) {
        throw new Error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      }

      const productData = {
        sku: formData.sku,
        name: formData.name,
        description: formData.description || "",
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        status: formData.status,
        image_urls: images,
      };

      if (editingProduct) {
        // Update existing product
        const token = localStorage.getItem("access_token");
        if (!token) {
          setModalError("กรุณาเข้าสู่ระบบใหม่");
          redirectToLogin();
          return;
        }
        
        const response = await fetch(`${API_URL}/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sku: productData.sku,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            stock: productData.stock,
            status: productData.status,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update product`);
        }

        setModalSuccess(true);
        await fetchProducts();
        
        setTimeout(() => {
          setShowEditModal(false);
          setEditingProduct(null);
          setModalSuccess(false);
          resetForm();
        }, 1500);
      } else {
        // Create new product
        const token = localStorage.getItem("access_token");
        if (!token) {
          setModalError("กรุณาเข้าสู่ระบบใหม่");
          redirectToLogin();
          return;
        }
        
        const response = await fetch(`${API_URL}/products`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          throw new Error(`Failed to create product`);
        }

        setModalSuccess(true);
        await fetchProducts();
        
        setTimeout(() => {
          setShowModal(false);
          setModalSuccess(false);
          resetForm();
        }, 1500);
      }
    } catch (err) {
      console.error("Error saving product:", err);
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      sku: "",
      name: "",
      description: "",
      price: "",
      stock: "",
      status: "active",
    });
    setImages([]);
    setEditingProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
    setModalError(null);
    setModalSuccess(false);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status,
    });
    setImages([]); // ไม่แสดงรูปเดิม (ถ้าต้องการให้แก้ไขรูปต้อง implement แยก)
    setShowEditModal(true);
    setModalError(null);
    setModalSuccess(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowEditModal(false);
    resetForm();
    setModalError(null);
    setModalSuccess(false);
  };

  const handleDelete = async (productId) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบ");
        return;
      }

      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok || response.status === 204) {
        alert("ลบสินค้าเรียบร้อยแล้ว");
        await fetchProducts();
      } else {
        throw new Error("ไม่สามารถลบสินค้าได้");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("เกิดข้อผิดพลาดในการลบสินค้า: " + err.message);
    }
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find((img) => img.is_primary);
      if (primaryImage) {
        const imageUrl = primaryImage.image_url;
        if (imageUrl.startsWith("/")) {
          return `${API_URL}${imageUrl}`;
        }
        return imageUrl;
      }
      const firstImage = product.images[0];
      const imageUrl = firstImage.image_url;
      if (imageUrl.startsWith("/")) {
        return `${API_URL}${imageUrl}`;
      }
      return imageUrl;
    }
    return "/placeholder-product.png";
  };

  // แสดง loading ขณะตรวจสอบ authentication
  if (authChecking) {
    return (
      <main className="bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20]">
        <div className="text-white text-center py-40">
          <div className="text-xl mb-2">กำลังตรวจสอบสิทธิ์การเข้าถึง...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mt-4"></div>
        </div>
      </main>
    );
  }
  
  // ถ้ายังไม่ได้ authenticate แสดง loading (จะ redirect ไป login)
  if (!isAuthenticated) {
    return (
      <main className="bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20]">
        <div className="text-white text-center py-40">
          <div className="text-xl mb-2">กำลังเปลี่ยนเส้นทางไปหน้า Login...</div>
        </div>
      </main>
    );
  }
  
  if (loading) {
    return (
      <main className="bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20]">
        <div className="text-white text-center py-40">
          <div className="text-xl mb-2">กำลังโหลดข้อมูลสินค้า...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20] pb-20">
      <div className="w-full max-w-7xl mx-auto px-6 pt-16">
        <div className="flex justify-between items-center mb-10">
          <div>
            <Link
              href="/product"
              className="inline-block mb-5 font-[sans-serif] text-lg font-[600] hover:text-[#9c9c9c] active:text-[#0067D1] text-white transition-colors"
            >
              ← Back to Store
            </Link>
            <h1 className="text-5xl md:text-6xl font-[sans-serif] font-[700] text-nowrap drop-shadow-2xl cursor-default text-white mb-3">
              Admin Panel
            </h1>
            <div className="h-1.5 w-32 bg-[#0067D1] rounded-full"></div>
          </div>
          <button
            onClick={openAddModal}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-lg transition font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            + Add New Product
          </button>
        </div>

        {error ? (
          <div className="text-red-400 text-center py-20 bg-red-900/20 rounded-2xl border border-red-700/50">
            <div className="text-xl mb-3 font-semibold">⚠️ Error</div>
            <div className="text-base mb-6">{error}</div>
            <button
              onClick={fetchProducts}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-white text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700/50">
            <div className="text-xl mb-3 font-semibold">No products found</div>
            <button
              onClick={openAddModal}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold mt-4 shadow-lg hover:shadow-xl transition"
            >
              Add First Product
            </button>
          </div>
        ) : (
          <div className="bg-neutral-600/30 backdrop-blur-sm rounded-3xl backdrop-opacity-10 border-2 border-gray-700/50 shadow-xl p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b-2 border-gray-700">
                    <th className="text-left py-5 px-6 font-semibold text-base">Image</th>
                    <th className="text-left py-5 px-6 font-semibold text-base min-w-[120px]">SKU</th>
                    <th className="text-left py-5 px-6 font-semibold text-base min-w-[200px]">Product Name</th>
                    <th className="text-left py-5 px-6 font-semibold text-base min-w-[120px]">Price</th>
                    <th className="text-left py-5 px-6 font-semibold text-base min-w-[100px] whitespace-nowrap">Stock</th>
                    <th className="text-left py-5 px-6 font-semibold text-base min-w-[140px] whitespace-nowrap">Status</th>
                    <th className="text-left py-5 px-6 font-semibold text-base min-w-[180px] whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-700/50 hover:bg-gray-800/50 transition duration-200">
                      <td className="py-5 px-6">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                          onError={(e) => {
                            e.target.src = "/placeholder-product.png";
                          }}
                        />
                      </td>
                      <td className="py-5 px-6 text-gray-300 font-medium">{product.sku}</td>
                      <td className="py-5 px-6">
                        <div className="font-semibold text-base mb-1">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-gray-400 line-clamp-2">
                            {product.description}
                          </div>
                        )}
                      </td>
                      <td className="py-5 px-6 text-yellow-400 font-semibold text-base">
                        ฿{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-5 px-6">
                        <span className="inline-block px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg font-semibold text-base min-w-[60px] text-center">
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span
                          className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${
                            product.status === "active"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {product.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEditModal(product)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-md hover:shadow-lg"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-md hover:shadow-lg"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal สำหรับเพิ่มสินค้า */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Add New Product</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white text-3xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition"
                  disabled={modalLoading}
                >
                  ×
                </button>
              </div>

              {modalError && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                  <strong>Error:</strong> {modalError}
                </div>
              )}

              {modalSuccess && (
                <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-200 text-sm">
                  <strong>Success!</strong> Product added successfully
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-white text-base font-semibold">
                      SKU <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="e.g. PROD001"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-white text-base font-semibold">
                      Product Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="e.g. Dumbbell 5kg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-white text-base font-semibold">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    placeholder="Product details..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-white text-base font-semibold">
                      Price (฿) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-white text-base font-semibold">
                      Stock <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-white text-base font-semibold">
                      Status
                    </label>
                    <input
                      type="text"
                      value="Active"
                      disabled
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-base opacity-60 cursor-not-allowed"
                    />
                    <input type="hidden" name="status" value="active" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-white text-base font-semibold">
                    Product Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={uploadingImages.length > 0}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-700 file:cursor-pointer"
                  />
                  {uploadingImages.length > 0 && (
                    <p className="mt-3 text-yellow-400 text-sm">
                      Uploading {uploadingImages.length} image(s)...
                    </p>
                  )}

                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-3">
                      {images.map((imgUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={`${API_URL}${imgUrl}`}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-28 object-cover rounded-lg border-2 border-gray-600 group-hover:border-blue-500 transition"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-lg opacity-0 group-hover:opacity-100 transition"
                          >
                            ×
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-semibold shadow-lg">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition text-base shadow-lg hover:shadow-xl"
                  >
                    {modalLoading ? "Saving..." : "Save Product"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={modalLoading}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition text-base shadow-lg hover:shadow-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal สำหรับแก้ไขสินค้า */}
      {showEditModal && editingProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Edit Product</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white text-3xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition"
                  disabled={modalLoading}
                >
                  ×
                </button>
              </div>

              {modalError && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                  <strong>Error:</strong> {modalError}
                </div>
              )}

              {modalSuccess && (
                <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-200 text-sm">
                  <strong>Success!</strong> Product updated successfully
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-gray-200 text-base font-semibold">
                      SKU <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-500 rounded-lg text-gray-100 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="e.g. PROD001"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-gray-200 text-base font-semibold">
                      Product Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-500 rounded-lg text-gray-100 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="e.g. Dumbbell 5kg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-200 text-base font-semibold">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-500 rounded-lg text-gray-100 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                    placeholder="Product details..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-gray-200 text-base font-semibold">
                      Price (฿) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-500 rounded-lg text-gray-100 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-200 text-base font-semibold">
                      Stock <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-500 rounded-lg text-gray-100 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-200 text-base font-semibold">
                      Status
                    </label>
                    <input
                      type="text"
                      value="Active"
                      disabled
                      className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-gray-400 text-base opacity-70 cursor-not-allowed"
                    />
                    <input type="hidden" name="status" value="active" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition text-base shadow-lg hover:shadow-xl"
                  >
                    {modalLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={modalLoading}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition text-base shadow-lg hover:shadow-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

