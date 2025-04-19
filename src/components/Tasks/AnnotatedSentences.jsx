import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import InnerLoader from "../InnerLoader"
import { Loader } from "lucide-react"
import { TablePagination } from "@mui/material";

function formatDateToLong(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
}

export default function AnnotatedSentences({ taskId }) {

    const navigate = useNavigate()
    const [annos, setAnnos] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleSentences = annos.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    useEffect(() => {
        const getAllAnnotations = async () => {
            setLoading(true)
            const url = `http://localhost:3000/annotation/${taskId}/viewannotatedsentences`
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
            }
            try {
                const annotations = await axios.get(url, { headers: headers })
                console.log(annotations.data)
                setAnnos(annotations.data)
            } catch (error) {
                console.log(error)
                if (error.status == 401) {
                    localStorage.removeItem('ACCESS_TOKEN')
                    navigate('/signin', { state: { message: 'Sesssion Expired. Sign in to continue', nextUrl: `viewtask?task_id=${taskId}` } })
                }
            }
            setLoading(false)
        }
        getAllAnnotations()
    }, [taskId])


    return (
        <>
            {loading ? <Loader /> :
                <div >
                    <div className="w-full h-[450px] overflow-y-auto ">
                        <table className="min-w-full h-[450px] border border-gray-300 relative" style={{ padding: '10px' }}>
                            <thead className="text-[15px] bg-gray-100">
                                <tr>
                                    <th scope="col" className="text-center px-2 py-3 border-r border-gray-300">Annotated by</th>
                                    <th scope="col" className="text-center px-2 py-3">Text</th>
                                    <th scope="col" className="text-center px-2 py-3 border-l border-gray-300">Annotated at</th>
                                    <th scope="col" className="text-center px-2 py-3 border-l border-gray-300">Label</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleSentences.map((sentence) => (
                                    <tr key={sentence.sentence_id} className="border-b border-gray-300 text-[14px]">
                                        <td className="text-center px-2 py-1 border-r border-gray-300 w-40">{sentence.annotated_by.name}</td>
                                        <td className="text-center px-2 py-1">{sentence.text}</td>
                                        <td className="text-center px-2 py-1 border-l border-gray-300 w-30">{formatDateToLong(sentence.created_at)}</td>
                                        <td className="text-center px-2 py-1 border-l border-gray-300 w-30">{sentence.label}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center bg-gray-100 mt-2">
                        <TablePagination
                            component="div"
                            count={annos.length}
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
            }
        </>
    )


}