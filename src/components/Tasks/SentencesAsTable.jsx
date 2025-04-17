import React, { useState } from "react";
import { TablePagination } from "@mui/material";

export default function SentencesAsTable({ sentences = [] }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleSentences = sentences.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <div className="w-full" style={{ borderRadius: '0' }}>
            <div className="w-full overflow-x-auto">
                <table className="min-w-full border border-gray-300" style={{ padding: '10px' }}>
                    <thead className="text-[15px] bg-gray-100">
                        <tr>
                            <th scope="col" className="text-center px-2 py-3 border-r border-gray-300">Sentence ID</th>
                            <th scope="col" className="text-center px-2 py-3">Text</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleSentences.map((sentence) => (
                            <tr key={sentence.sentence_id} className="border-b border-gray-300 text-[14px]">
                                <td className="text-center px-2 py-1 border-r border-gray-300 w-20">{sentence.sentence_id}</td>
                                <td className="text-center px-2 py-1">{sentence.sentence_text}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center bg-gray-100 mt-2">
                <TablePagination
                    component="div"
                    count={sentences.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    labelRowsPerPage="Sentences per page:"
                    sx={{ margin: 'auto' }}
                />
            </div>
        </div>

    );
}
