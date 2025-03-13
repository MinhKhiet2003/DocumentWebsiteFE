import React from "react";
// import { Link } from "react-router-dom";
// import { useQuery } from "react-query";
// import { getBooks } from "../../api";
// import "ResourceCard.css";  

// const ResourceCard = ({ title, author }) => {
//   return (
//     <div className="border p-4 shadow-md rounded-lg">
//       <h2 className="text-lg font-semibold">{title}</h2>
//       <p className="text-sm text-gray-500">Tác giả: {author}</p>
//       <p className="text-yellow-500">⭐⭐⭐⭐⭐</p>
//     </div>
//   );
// };

const ResourceCard = ({ title, author, rating }) => {
  return (
    <div className="card">
      <img src="" alt="" className="card-image" />
      <div className="card-content">
        <h3>{title}</h3>
        <p>Tác giả: {author}</p>
        <p>⭐ {rating}</p>
      </div>
    </div>
  );
};

export default ResourceCard;
