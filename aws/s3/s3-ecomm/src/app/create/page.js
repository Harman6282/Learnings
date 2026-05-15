"use client";
import { useState, useRef } from "react";

export default function page() {
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      console.log("selected file:", file);
    }
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const mime = image.type.split("/")[1];
    console.log("mime:", mime);

    const res = await fetch("http://localhost:8080/get-presigned-url", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        mime,
      }),
    });

    if (!res) {
      console.log("error getting presigned url");
      return;
    }

    const data = await res.json();

    const response = await fetch(data.url, {
      method: "PUT",
      headers: {
        "Content-Type": image.type || "application/octet-stream",
      },
      body: image,
    })

    if(!response){
      console.log("error uploading file to s3")
      return 
    }

    console.log("data", data.url);

    console.log("file:", image);

    setTimeout(() => setSubmitted(false), 3000);
  };

  

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.3em] text-amber-500 uppercase mb-2">
            Inventory
          </p>
          <h1 className="text-3xl font-bold text-stone-100 tracking-tight">
            New Product
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div className="group">
            <label className="block text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Handcrafted Leather Wallet"
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe your product — materials, dimensions, key features..."
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">
              Product Image
            </label>
            <div
              onChange={handleImageChange}
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden
                ${
                  isDragging
                    ? "border-amber-500 bg-amber-500/5"
                    : "border-stone-700 bg-stone-900 hover:border-stone-500"
                }`}
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-52 object-cover"
                  />
                  <div className="absolute inset-0 bg-stone-950/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-stone-200 text-sm font-medium">
                      Click to change
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center mb-3">
                    <svg
                      className="w-5 h-5 text-stone-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                  </div>
                  <p className="text-stone-300 text-sm font-medium">
                    Drop image here or{" "}
                    <span className="text-amber-500">browse</span>
                  </p>
                  <p className="text-stone-600 text-xs mt-1">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
            {image && (
              <p className="text-xs text-stone-500 mt-2 truncate">
                {image.name}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">
              Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-semibold">
                $
              </span>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-8 pr-4 py-3 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200
                ${
                  submitted
                    ? "bg-emerald-600 text-white"
                    : "bg-amber-500 hover:bg-amber-400 text-stone-950 active:scale-[0.98]"
                }`}
            >
              {submitted ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Product Created
                </span>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
