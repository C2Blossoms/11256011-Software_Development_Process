"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProductDetail();
    }
  }, [params.id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/products/${params.id}`);

      if (!response.ok) {
        throw new Error(`ไม่สามารถดึงข้อมูลสินค้าได้ (${response.status})`);
      }

      const data = await response.json();
      setProduct(data);
      
      // ตั้งค่ารูปที่เลือกเป็นรูปหลัก หรือรูปแรก
      if (data.images && data.images.length > 0) {
        const primaryImage = data.images.find((img) => img.is_primary);
        setSelectedImage(primaryImage || data.images[0]);
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder-product.png";
    if (imageUrl.startsWith("/")) {
      return `${API_URL}${imageUrl}`;
    }
    return imageUrl;
  };

  const addToCart = async () => {
    if (!product || product.stock === 0 || product.status !== "active") {
      return;
    }

    try {
      setAddingToCart(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อน");
        router.push("/login");
        return;
      }
      
      const response = await fetch(`${API_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          qty: 1,
        }),
      });
      
      if (response.ok || response.status === 201) {
        alert("เพิ่มสินค้าลงตะกร้าเรียบร้อย");
      } else {
        // ลองอ่าน error message จาก response
        let errorMessage = "ไม่สามารถเพิ่มสินค้าได้";
        try {
          const errorText = await response.text();
          if (errorText) {
            // ลอง parse เป็น JSON ก่อน
            try {
              const errorJson = JSON.parse(errorText);
              errorMessage = errorJson.error || errorJson.message || errorText;
            } catch {
              // ถ้าไม่ใช่ JSON ใช้เป็น plain text
              errorMessage = errorText;
            }
          }
          
          // แปล error message เป็นภาษาไทย
          if (errorMessage.includes("unauthorized")) {
            errorMessage = "กรุณาเข้าสู่ระบบก่อน";
          } else if (errorMessage.includes("product not found")) {
            errorMessage = "ไม่พบสินค้านี้";
          } else if (errorMessage.includes("product inactive")) {
            errorMessage = "สินค้านี้ไม่พร้อมขาย";
          } else if (errorMessage.includes("insufficient stock")) {
            errorMessage = "สินค้าในสต็อกไม่พอ";
          } else if (errorMessage.includes("invalid body")) {
            errorMessage = "ข้อมูลไม่ถูกต้อง";
          }
        } catch (e) {
          console.error("Error reading error response:", e);
        }
        
        console.error("Error adding to cart:", response.status, errorMessage);
        alert(errorMessage);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า: " + (err.message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"));
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-white text-center py-20">
            <div className="text-xl">กำลังโหลดข้อมูล...</div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-red-400 text-center py-20">
            <div className="text-xl mb-4">⚠️ เกิดข้อผิดพลาด</div>
            <div className="text-sm mb-4">{error}</div>
            <button
              onClick={() => router.push("/product")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              กลับไปหน้ารายการสินค้า
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-white text-center py-20">
            <div className="text-xl mb-4">ไม่พบสินค้า</div>
            <button
              onClick={() => router.push("/product")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              กลับไปหน้ารายการสินค้า
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* ปุ่มย้อนกลับ */}
        <button
          onClick={() => router.push("/product")}
          className="mb-6 text-white hover:text-blue-400 flex items-center gap-2 transition"
        >
          <span>←</span> กลับไปหน้ารายการสินค้า
        </button>

        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* ส่วนรูปภาพ */}
            <div>
              {/* รูปใหญ่ที่เลือก */}
              <div className="mb-4 bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={getImageUrl(selectedImage?.image_url)}
                  alt={product.name}
                  className="w-full h-96 object-contain"
                  onError={(e) => {
                    e.target.src = "/placeholder-product.png";
                  }}
                />
              </div>

              {/* Gallery รูปย่อ */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className={`relative bg-gray-700 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage?.id === image.id
                          ? "border-blue-500"
                          : "border-transparent hover:border-gray-500"
                      }`}
                    >
                      <img
                        src={getImageUrl(image.image_url)}
                        alt={`${product.name} - รูปที่ ${index + 1}`}
                        className="w-full h-20 object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-product.png";
                        }}
                      />
                      {image.is_primary && (
                        <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded">
                          หลัก
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {(!product.images || product.images.length === 0) && (
                <div className="text-gray-400 text-center text-sm">
                  ไม่มีรูปภาพ
                </div>
              )}
            </div>

            {/* ส่วนข้อมูลสินค้า */}
            <div className="text-white">
              <div className="mb-4">
                <span className="text-gray-400 text-sm">SKU: {product.sku}</span>
              </div>

              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-yellow-400">
                    ฿{product.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-700">
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">สถานะ:</span>{" "}
                    <span className="font-semibold text-green-400">
                      พร้อมขาย
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">คงเหลือ:</span>{" "}
                    <span
                      className={`font-semibold ${
                        product.stock > 10
                          ? "text-green-400"
                          : product.stock > 0
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {product.stock} ชิ้น
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {product.description || "ไม่มีคำอธิบาย"}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={addToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {addingToCart
                    ? "กำลังเพิ่ม..."
                    : product.stock === 0
                    ? "สินค้าหมด"
                    : "เพิ่มลงตะกร้า"}
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition">
                  ♥
                </button>
              </div>

              {/* ข้อมูลเพิ่มเติม */}
              <div className="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400">
                <div className="mb-2">
                  <strong>เพิ่มเมื่อ:</strong>{" "}
                  {new Date(product.created_at).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                {product.updated_at && (
                  <div>
                    <strong>อัปเดตล่าสุด:</strong>{" "}
                    {new Date(product.updated_at).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

