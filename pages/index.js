import React, { useState } from "react";
import {
  CiTextAlignCenter,
  CiTextAlignLeft,
  CiTextAlignRight,
} from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { GrFormSubtract } from "react-icons/gr";
import * as XLSX from "xlsx";
import { useSelector, useDispatch } from "react-redux";
import {
  UpdateTableData,
  changeTextType,
  changeAlignment,
  increaseFontSize,
  decreaseFontSize,
} from "../Redux/TableData";
const PAGE_SIZE = 10; // Number of rows per page

export default function Home() {
  const dispatch = useDispatch();

  // states
  const [selectedcolumn, setselectedcolumn] = useState({
    row: null,
    col: null,
  });
  const [selectedOption, setSelectedOption] = useState("text");
  const [fontsize, setfontsize] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const tabledata = useSelector((state) => state.tData);

  //for genrating the a to z columns number
  const ColumnArray = Array.from({ length: 26 }, (_, index) =>
    String.fromCharCode(index + 65)
  );

  function updateData(rowIndex, colIndex, value) {
    dispatch(
      UpdateTableData({
        rowIndex: rowIndex,
        colIndex: colIndex,
        value: value,
      })
    );
  }

  const changestyle = (rowindex, colindex) => {
    const fSize = tabledata[rowindex][colindex].fontsize;
    const type = tabledata[rowindex][colindex].texttype;
    setfontsize(fSize);
    setSelectedOption(type);
    setselectedcolumn({ row: rowindex, col: colindex });
  };

  const increasefontsize = () => {
    setfontsize(fontsize + 1);
    dispatch(
      increaseFontSize({
        rowIndex: selectedcolumn.row,
        colIndex: selectedcolumn.col,
      })
    );
  };
  const decreasefontsize = () => {
    if (fontsize > 15) {
      setfontsize(fontsize - 1);
      dispatch(
        decreaseFontSize({
          rowIndex: selectedcolumn.row,
          colIndex: selectedcolumn.col,
        })
      );
    }
  };

  function updattextType(e) {
    if (selectedcolumn.row !== null && selectedcolumn.col !== null) {
      dispatch(
        changeTextType({
          rowIndex: selectedcolumn.row,
          colIndex: selectedcolumn.col,
          newTextType: e.target.value,
        })
      );
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedData = tabledata.slice(startIndex, endIndex);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet(
      tabledata.map((row) => row.map((cell) => cell.value))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "tabledata.xlsx");
  };

  console.log(paginatedData);
  return (
    <div className="w-full bg-white py-0 font-serif">
      {/* header section  */}
      <div className="w-full bg-white ring-2 p-4 select-none shadow-2xl flex gap-8 h-28 fixed top-0 z-20 lg:w-full   justify-start ">
        {/* text Alignment area */}
        <div className="lg:w-32 sm:w-20 h-full">
          <h1 className="my-2 lg:text-lg md:text-sm">Text Alignment</h1>
          <div className="w-full flex justify-start gap-2 items-center">
            <CiTextAlignLeft
              onClick={() => {
                dispatch(
                  changeAlignment({
                    rowIndex: selectedcolumn.row,
                    colIndex: selectedcolumn.col,
                    newAlignment: "start",
                  })
                );
              }}
              className={` lg:h-8 lg:w-8 sm:w-6 sm:h-6 text-black border-2 hover:text-gray-300`}
            />
            <CiTextAlignCenter
              className="lg:h-8 lg:w-8 sm:w-6 sm:h-6 text-black border-2 hover:text-gray-300"
              onClick={() => {
                dispatch(
                  changeAlignment({
                    rowIndex: selectedcolumn.row,
                    colIndex: selectedcolumn.col,
                    newAlignment: "center",
                  })
                );
              }}
            />
            <CiTextAlignRight
              className="lg:h-8 lg:w-8 sm:w-6 sm:h-6 text-black border-2 hover:text-gray-300"
              onClick={() => {
                dispatch(
                  changeAlignment({
                    rowIndex: selectedcolumn.row,
                    colIndex: selectedcolumn.col,
                    newAlignment: "end",
                  })
                );
              }}
            />
          </div>
        </div>

        {/* fontsize area  */}
        <div className="lg:w-32 sm:w-20 h-full">
          <h1 className="my-2 lg:text-lg md:text-sm">Font Size</h1>
          <div className="w-full flex justify-start items-center">
            <IoMdAdd
              className="lg:h-8 lg:w-8 sm:w-6 sm:h-6 sm:p-0 lg:p-2 text-black border-2 hover:text-gray-300"
              onClick={() => increasefontsize()}
            />
            <h1 className="px-8 w-8 h-8 flex justify-center items-center text-black border-2">
              {fontsize}
            </h1>
            <GrFormSubtract
              className="lg:h-8 lg:w-8 sm:w-6 sm:h-6 sm:p-0 lg:p-2 text-black border-2 hover:text-gray-300"
              onClick={() => decreasefontsize()}
            />
          </div>
        </div>

        {/* text type area  */}
        <div className="lg:w-32 sm:w-20 h-full flex items-start justify-center flex-col">
          <h1 className="my-2 lg:text-lg md:text-sm">TextType</h1>
          <div className="relative inline-block text-left">
            <select
              value={selectedOption}
              onChange={updattextType}
              className="block w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <option value="text" selected>
                Text
              </option>
              <option value="number">Number</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
            </select>
          </div>
        </div>

        {/* Excel button  */}
        <div className="  flex items-end justify-center ">
          <button
            className=" lg:px-4  md:px-2 sm:py-1 w-full   lg:text-lg md:text-xs  rounded-lg bg-green-500 "
            onClick={() => exportToExcel()}
          >
            Export Excel
          </button>
        </div>
      </div>

      <table className="table-auto border border-gray-400 border-collapse mt-32 text-xs w-full">
        <thead>
          <tr className="border">
            <th className="border border-gray-400 px-4 py-2"></th>
            {/* table header  */}
            {ColumnArray.map((item, index) => (
              <th key={index} className="border border-gray-400 px-8 py-2">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border border-gray-600 w-96 scroll-smooth"
            >
              {/* table index */}
              <td className="border border-gray-400 text-center font-bold">
                {startIndex + rowIndex + 1}
              </td>

              {/* table row and col genrating  */}
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border border-gray-400 bg-white">
                  <input
                    style={{
                      fontSize: cell.fontsize,
                      textAlign: `${cell.align}`,
                    }}
                    type={cell.texttype}
                    className="w-full h-full outline-none py-2 px-1"
                    value={cell.value}
                    onChange={(e) =>
                      updateData(
                        startIndex + rowIndex,
                        colIndex,
                        e.target.value
                      )
                    }
                    onSelect={() =>
                      changestyle(startIndex + rowIndex, colIndex)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mx-auto   mt-4 max-w-4xl gap-11">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={endIndex >= tabledata.length}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}
