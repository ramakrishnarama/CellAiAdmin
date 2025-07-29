"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  variants: string;
  category: string;
  timestamp: Date;
  image: string;
  status: "Warning" | "Critical" | "SOS";
}

const tableData: Product[] = [
  {
    id: 1,
    name: "High Temperature",
    variants: "BATT00001",
    category: "Laptop",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 5 mins ago
    status: "Warning",
    image: "/images/product/highTemp.jpeg",
  },
  {
    id: 2,
    name: "Cell Over Voltage",
    variants: "BATT00002",
    category: "Watch",
    timestamp: new Date(Date.now() - 12 *  60 * 60 * 1000),
    status: "Critical",
    image: "/images/product/cellOverVolt.jpeg",
  },
  {
    id: 3,
    name: "Low SOC",
    variants: "BATT00003",
    category: "SmartPhone",
    timestamp: new Date(Date.now() - 35 *  60 * 60 * 1000), // 5 mins ago
    status: "SOS",
    image: "/images/product/lowsoc.jpeg",
  },
];

export default function RecentOrders() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* <div className="flex flex-col text-center gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg text-center font-semibold text-gray-800 dark:text-white/90">
          Recent Alerts
        </h3> */}

        <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent Alerts
        </h3>

        {/* <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div> */}
      </div>

      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                Alert
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                Date
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                Time
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="py-3 text-center">
                  <div className="flex items-center gap-3">
                    {/* Image box */}
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md flex-shrink-0">
                      <Image
                        width={50}
                        height={50}
                        src={product.image}
                        className="object-cover h-full w-full"
                        alt={product.name}
                      />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col justify-center">
                      <p className="font-medium text-left text-gray-800 text-theme-sm dark:text-white/90 leading-tight">
                        {product.name}
                      </p>
                      <span className="text-gray-500 text-left text-theme-xs dark:text-gray-400">
                        {product.variants}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.timestamp.toLocaleDateString("en-IN")}
                </TableCell>

                <TableCell className="py-3 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.timestamp.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>

                <TableCell className="py-3 text-center">
                  <Badge
                    size="sm"
                    color={
                      product.status === "Warning"
                        ? "success"
                        : product.status === "Critical"
                        ? "warning"
                        : "error"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import Badge from "../ui/badge/Badge";
// import Image from "next/image";

// // Define the TypeScript interface for the table rows
// interface Product {
//   id: number;
//   name: string;
//   variants: string;
//   category: string;
//   date: Date;
//   image: string;
//   status: "Warning" | "Critical" | "SOS";
// }

// // Sample table data
// const tableData: Product[] = [
//   {
//     id: 1,
//     name: "FLOWBATT00001",
//     variants: "2 Variants",
//     category: "Laptop",
//     date: new Date(),
//     status: "Warning",
//     image: "/images/product/warning.png",
//   },
//   {
//     id: 2,
//     name: "FLOWBATT00002",
//     variants: "1 Variant",
//     category: "Watch",
//     date: new Date(),
//     status: "Critical",
//     image: "/images/product/critical.png",
//   },
//   {
//     id: 3,
//     name: "FLOWBATT00003",
//     variants: "2 Variants",
//     category: "SmartPhone",
//     date: new Date(),
//     status: "SOS",
//     image: "/images/product/lowsoc.png",
//   }
// ];

// export default function RecentOrders() {
//   return (
//     <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
//       <div className="max-w-full overflow-x-auto">
//         <Table>
//           {/* Table Header */}
//           <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
//             <TableRow>
//               <TableCell
//                 isHeader
//                 className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
//               >
//                 Alert
//               </TableCell>
//               <TableCell
//                 isHeader
//                 className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
//               >
//                 Battery
//               </TableCell>
//               <TableCell
//                 isHeader
//                 className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
//               >
//                 Date
//               </TableCell>
//               <TableCell
//                 isHeader
//                 className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
//               >
//                 Status
//               </TableCell>
//             </TableRow>
//           </TableHeader>

//           {/* Table Body */}
//           <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
//             {tableData.map((product) => (
//               <TableRow key={product.id}>
//                 <TableCell className="py-3">
//                   <div className="flex items-center gap-3">
//                     <div className="h-[30px] w-[30px] overflow-hidden rounded-md">
//                       <Image
//                         width={30}
//                         height={30}
//                         src={product.image}
//                         className="h-[30px] w-[30px] object-cover"
//                         alt={product.name}
//                       />
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell className="py-3">
//                   <div className="flex items-center gap-3">
//                     <div>
//                       <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
//                         {product.name}
//                       </p>
//                       {/* <span className="text-gray-500 text-theme-xs dark:text-gray-400">
//                         {product.variants}
//                       </span> */}
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
//                   {product.date.toLocaleString("en-IN", {
//                     dateStyle: "medium",
//                     timeStyle: "short",
//                   })}
//                 </TableCell>

//                 <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
//                   <Badge
//                     size="sm"
//                     color={
//                       product.status === "Warning"
//                         ? "success"
//                         : product.status === "Critical"
//                         ? "warning"
//                         : "error"
//                     }
//                   >
//                     {product.status}
//                   </Badge>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }
