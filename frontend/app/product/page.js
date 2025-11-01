"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ProductPage() {
  // State สำหรับเก็บข้อมูลสินค้า
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
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

  // ดึงข้อมูลจาก backend ตอนหน้าโหลด
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/products`);
      
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
      const uploadPromises = files.map(async (file) => {
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);

        const response = await fetch(`${API_URL}/products/upload-image`, {
          method: "POST",
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
      if (!formData.sku || !formData.name || !formData.price || !formData.stock) {
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

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create product`);
      }

      setModalSuccess(true);
      
      setFormData({
        sku: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        status: "active",
      });
      setImages([]);

      await fetchProducts();

      setTimeout(() => {
        setShowModal(false);
        setModalSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Error creating product:", err);
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
    setModalError(null);
    setModalSuccess(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      sku: "",
      name: "",
      description: "",
      price: "",
      stock: "",
      status: "active",
    });
    setImages([]);
    setModalError(null);
    setModalSuccess(false);
  };


  return (
    <main className="bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20]">
      <div className="relative gap-1 self-center justify-self-center top-0 w-[90%] mx-auto bg-neutral-600/30 backdrop-blur-sm rounded-[40px] backdrop-opacity-10 border-2 p-6">
        <div className="w-[100%] flex justify-evenly justify-self-center h-full select-text">
          {/* ========== ด้านซ้าย: Selection Filter ========== */}
          <div className="sticky flex flex-col top-0 order-1 ml-10 mt-15 h-fit w-[16%] font-[sans-serif]">
            <div className="pb-5 font-[sans-serif] text-xl font-[600] text-nowrap drop-shadow-2xl cursor-default text-white">
              Selection Filter
            </div>
            <span className="font-[sans-serif] text-xl font-[400] text-nowrap drop-shadow-2xl cursor-default text-white">
              Category
            </span>
            <div className="pb-4 grid w-40">
              <select className="pl-1 col-start-1 row-start-1 appearance-none bg-gray-800 border-2 rounded w-40 font-[sans-serif] text-lg font-[500] text-nowrap drop-shadow-2xl z-10 text-white">
                <option>All</option>
                <option>Dumbell</option>
                <option>Treadmill</option>
                <option>Whey protein</option>
              </select>
              <img
                src="selec-1.png"
                className="mr-1.5 pointer-events-none flex self-center justify-self-end w-5 col-start-1 row-start-1 z-20"
              />
            </div>
            <span className="font-[sans-serif] text-xl font-[400] text-nowrap drop-shadow-2xl cursor-default text-white">
              Brand
            </span>
            <div className="pb-4 grid w-40">
              <select className="pl-1 col-start-1 row-start-1 appearance-none bg-gray-800 border-2 rounded w-40 font-[sans-serif] text-lg font-[500] text-nowrap drop-shadow-2xl z-10 text-white">
                <option>All</option>
                <option>brand1</option>
                <option>brand2</option>
              </select>
              <img
                src="selec-1.png"
                className="mr-1.5 pointer-events-none flex self-center justify-self-end w-5 col-start-1 row-start-1 z-20"
              />
            </div>
            <span className="font-[sans-serif] text-xl font-[400] text-nowrap drop-shadow-2xl cursor-default text-white">
              Price
            </span>
            <div className="grid w-40">
              <select className="pl-1 col-start-1 row-start-1 appearance-none bg-gray-800 border-2 rounded w-40 font-[sans-serif] text-lg font-[500] text-nowrap drop-shadow-2xl z-10 text-white">
                <option>All</option>
                <option>under 500฿</option>
                <option>500 - 1000฿</option>
                <option>over 1000฿</option>
              </select>
              <img
                src="selec-1.png"
                className="mr-1.5 pointer-events-none flex self-center justify-self-end w-5 col-start-1 row-start-1 z-20"
              />
            </div>
          </div>

          {/* ========== ตรงกลาง: Product List ========== */}
          <div className="flex flex-col order-2 mt-15 w-[62%] font-[sans-serif]">
            <div className="flex justify-between items-center mb-6">
              <div className="text-xl font-[600] text-nowrap drop-shadow-2xl cursor-default text-white">
                Product
              </div>
              <button
                onClick={openModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-semibold text-sm"
              >
                + เพิ่มสินค้า
              </button>
            </div>

            {loading ? (
              <div className="text-white text-center py-20">
                <div className="text-xl mb-2">กำลังโหลดข้อมูลสินค้า...</div>
              </div>
            ) : error ? (
              <div className="text-red-400 text-center py-20">
                <div className="text-xl mb-2">⚠️ เกิดข้อผิดพลาด</div>
                <div className="text-sm mb-4">{error}</div>
                <button 
                  onClick={fetchProducts}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  ลองอีกครั้ง
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-white text-center py-20">
                <div className="text-xl mb-2">ไม่มีสินค้าในระบบ</div>
                <button 
                  onClick={openModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4"
                >
                  เพิ่มสินค้าแรก
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer"
                  >
                    <div className="relative w-full h-48 bg-gray-700">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-product.png";
                        }}
                      />
                      {product.images && product.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {product.images.length} รูป
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-gray-400 mb-1">SKU: {product.sku}</div>
                      <h3 className="text-white text-lg font-semibold mb-2 truncate">
                        {product.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {product.description || "ไม่มีคำอธิบาย"}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-400 text-xl font-bold">
                          ฿{product.price.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm">
                          คงเหลือ: {product.stock}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ========== ด้านขวา: Shopping Cart ========== */}
          <div className="sticky top-0 mr-6 flex flex-col order-3 mt-15 h-fit w-[22%] font-[sans-serif]">
            <div className="pb-5 font-[sans-serif] text-xl font-[600] text-nowrap drop-shadow-2xl cursor-default text-white">
              Shopping Cart
            </div>
            <div className="w-48 active:text-[#0067D1] hover:underline underline-offset-2 font-[sans-serif] text-lg font-[400] text-nowrap drop-shadow-2xl text-white">
              <a href="/checkout" rel="noopener noreferrer">
                continue to checkout ≫
              </a>
            </div>
            <button className="hover:text-[#ec0000] active:text-[#0067D1] cursor-pointer text-neutral-400 grid place-self-end w-15 font-[sans-serif] text-md font-thin text-nowrap drop-shadow-xl">
              clear all
            </button>
          </div>
        </div>
      </div>

      {/* Modal สำหรับเพิ่มสินค้า */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">เพิ่มสินค้าใหม่</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white text-3xl leading-none"
                  disabled={modalLoading}
                >
                  ×
                </button>
              </div>

              {modalError && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
                  <strong>เกิดข้อผิดพลาด:</strong> {modalError}
                </div>
              )}

              {modalSuccess && (
                <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded text-green-200 text-sm">
                  <strong>สำเร็จ!</strong> เพิ่มสินค้าเรียบร้อยแล้ว
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-1 text-sm font-semibold">
                      SKU <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                      placeholder="เช่น PROD001"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-1 text-sm font-semibold">
                      ชื่อสินค้า <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                      placeholder="เช่น ดัมเบล 5 กก."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-1 text-sm font-semibold">
                    คำอธิบาย
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="รายละเอียดสินค้า..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white mb-1 text-sm font-semibold">
                      ราคา (฿) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1 text-sm font-semibold">
                      สต็อก <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1 text-sm font-semibold">
                      สถานะ
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="active">พร้อมขาย</option>
                      <option value="inactive">ไม่พร้อมขาย</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-1 text-sm font-semibold">
                    รูปภาพสินค้า
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={uploadingImages.length > 0}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  {uploadingImages.length > 0 && (
                    <p className="mt-2 text-yellow-400 text-xs">
                      กำลังอัปโหลด {uploadingImages.length} รูป...
                    </p>
                  )}

                  {images.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {images.map((imgUrl, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`${API_URL}${imgUrl}`}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded border border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded">
                              หลัก
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition text-sm"
                  >
                    {modalLoading ? "กำลังบันทึก..." : "บันทึกสินค้า"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={modalLoading}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white font-semibold rounded transition text-sm"
                  >
                    ยกเลิก
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
