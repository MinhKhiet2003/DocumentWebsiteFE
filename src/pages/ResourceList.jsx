import React from "react";
import ResourceCard from "../components/ResourceCard";
import Pagination from "../components/Pagination";
import Tabs from "../components/Tabs";

const ResourceList = () => {
  const resources = [
    { title: "Luyện tập Chứng Cộng Trừ", author: "Trần Kim Thanh" },
    { title: "Hóa học 9-KHTN: Giới thiệu hợp chất hữu cơ", author: "Đàm Thị Ánh Điệp" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Danh sách tài liệu</h1>
      <Tabs />
      <div className="grid grid-cols-3 gap-4 mt-4">
        {resources.map((res, index) => (
          <ResourceCard key={index} title={res.title} author={res.author} />
        ))}
      </div>
      <Pagination />
    </div>
  );
};

export default ResourceList;
