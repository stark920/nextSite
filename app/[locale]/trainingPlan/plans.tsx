// import React, { useState } from 'react';

// const NestedListWithSearch = () => {
//   const initialData = [
//     { category: 'Fruits', items: ['Apple', 'Banana', 'Cherry'] },
//     { category: 'Vegetables', items: ['Carrot', 'Broccoli', 'Spinach'] },
//     { category: 'Dairy', items: ['Milk', 'Cheese', 'Yogurt'] },
//   ];

//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredData, setFilteredData] = useState(initialData);

//   const handleSearch = (event) => {
//     const value = event.target.value.toLowerCase();
//     setSearchTerm(value);

//     const filtered = initialData
//       .map((category) => ({
//         category: category.category,
//         items: category.items.filter((item) => item.toLowerCase().includes(value)),
//       }))
//       .filter((category) => category.items.length > 0);

//     setFilteredData(filtered);
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <input
//         type="text"
//         value={searchTerm}
//         onChange={handleSearch}
//         placeholder="Search items..."
//         className="border p-2 w-full mb-4 rounded"
//       />
//       <Accordion data={filteredData} />
//     </div>
//   );
// };

// export default NestedListWithSearch;
