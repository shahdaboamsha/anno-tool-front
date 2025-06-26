import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Loader from '../../Loaders/Loader'
import { Button, TablePagination, Alert, IconButton, Tooltip, Badge, Divider } from "@mui/material";
import { sentencesFilter } from '../../../utils/appData.json'
import Filter from "./Filter"
import NoteForm from "./NoteForm"
import QuickDialog from "../../Public/QuickDialog"
import UpdateAnnotation from "./UpdateAnnotation";
import { useOutletContext } from "react-router-dom";
import ResponseMessage from "../../../utils/ResponsesMessage";
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import NotesView from "./NotesView";
import SessionController from "../../../utils/SessionController";
import InputSelect from "../../Inputs/InputSelect";

axios.defaults.withCredentials = true;

const formatDateToLong = (dateString) => {
    const date = new Date(dateString)
    const options = { day: 'numeric', month: 'long', year: 'numeric' }
    return new Intl.DateTimeFormat('en-GB', options).format(date)
}

const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
export default function AnnotatedSentences({ task }) {

    const navigate = useNavigate()
    const { userData } = useOutletContext()
    const [loading, setLoading] = useState(true)

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const [filteredAnnos, setFilteredAnnos] = useState([])
    const [annos, setAnnos] = useState([])
    const [notes, setNotes] = useState([])

    const [NoteDialogState, setOpenNoteDialg] = useState(false)
    const [UpdateDialogState, setOpenUpdateDialogState] = useState(false)
    const [viewNotesDialogState, setOpenViewNotesDialogState] = useState(false)

    const [selectedAnnotatorId, setSelectedAnnotatorId] = useState("")

    const [anyChanges, setAnyChanges] = useState(1)
    const [alertMsg, setAlertMsg] = useState({
        isError: false, message: null
    })
    const notifyChanges = (feedback) => {
        setAnyChanges(prev => prev + 1)
        setAlertMsg(feedback)
    }

    const [selectedAnnotation, setSelectedAnnotation] = useState(null)

    const openUpdateDialog = () => {
        setOpenUpdateDialogState(prev => !prev)
    }

    const openNoteDialog = () => {
        setOpenNoteDialg(prev => !prev)
    }

    const openNViewNotesDialog = () => {
        setOpenViewNotesDialogState(prev => !prev)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const visibleSentences = filteredAnnos.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    )

    useEffect(() => {

        const getAllAnnotations = async () => {

            setLoading(true)
            const url1 = `${import.meta.env.VITE_API_URL}/assignsample/${task.task_id}/sample-annotations`
            const url2 = `${import.meta.env.VITE_API_URL}/notes/${task.task_id}/getallnotes`
            const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }

            try {

                const annotations = await axios.get(url1, { headers: headers })
                const notes = await axios.get(url2, { headers: headers })

                setAnnos(annotations.data)
                setFilteredAnnos(annotations.data)
                setNotes(notes.data.notes)
                
            } catch (error) {
                if (error.code == "ERR_NETWORK") {
                    setAlertMsg({ isError: true, message: ResponseMessage.ERR_NETWORK_MSG })
                }
                else if (error.status == 401) {
                    const refreshError = await SessionController.refreshToken()
                    if (refreshError instanceof Error) {
                        localStorage.removeItem('ACCESS_TOKEN')
                        navigate('/signin', { state: { message: ResponseMessage.UN_AUTHORIZED_MSG } })
                    }
                    else {
                        await getAllAnnotations()
                    }
                }
                else {
                    console.log(error.response.data)
                    setAlertMsg({ isError: true, message: ResponseMessage.INTERNAL_SERVER_ERROR_MSG })
                }
            } finally {
                setLoading(false)
            }

        }
        getAllAnnotations()
    }, [anyChanges])

    const getAllAnnotatorsNames = () => {
        const annotatorsNames = []
        annos.forEach(annotation => {
            annotation.annotations.forEach(annotator => annotatorsNames.push(annotator.user_name))
        })
        return Array.from(new Set(annotatorsNames))
    }

    const handleAnnotatorSelection = (e) => {
        setSelectedAnnotatorId(e.target.value)
        setFilteredAnnos(findAnnotationsByUserId(e.target.value))
    }

    const findAnnotationsByUserId = (selectedAnnotatorId) => {

        if (!selectedAnnotatorId) return annos

        setSelectedAnnotatorId(selectedAnnotatorId)
        const filtered = annos
            .filter(sentence =>
                sentence.annotations?.some(annotation => annotation.user_name === selectedAnnotatorId)
            )
            .map(sentence => {
                const filteredAnnotation = sentence.annotations.find(
                    annotation => annotation.user_name === selectedAnnotatorId
                )

                return {
                    ...sentence,
                    annotations: [filteredAnnotation]
                }
            })

        return filtered
    }


    return (
        <>
            {loading ? <Loader /> :
                <div className="p-3">
                    <h1 className="text-[20px] font-medium w-full">Annotations</h1>
                    <div className="flex justify-end text-[14px]">
                        <Tooltip title="Show notes">
                            <Badge color="secondary" badgeContent={notes.length}>
                                <IconButton onClick={openNViewNotesDialog}>
                                    <QuestionAnswerOutlinedIcon fontSize="small" sx={{ color: 'red' }} />
                                </IconButton>
                            </Badge>
                        </Tooltip>
                    </div>

                    <div className="w-100">
                        <h1 className="mb-3 text-[15px]">Filter annotations by annotator name</h1>
                        <InputSelect required
                            name='selectedAnnotatorId'
                            title="Select annotator"
                            value={selectedAnnotatorId}
                            menuItems={getAllAnnotatorsNames()}
                            changeHandler={handleAnnotatorSelection}
                            withDetection={false}
                        />
                    </div>

                    <div className="mt-2">
                        {alertMsg.message && <Alert severity={alertMsg.isError ? 'error' : 'success'}>{alertMsg.message}</Alert>}
                    </div>


                    <div className=" overflow-y-auto mt-3">
                        <table className="min-w-full h-[450px] border border-gray-300 relative" style={{ padding: '10px' }}>
                            <thead className="text-[15px] bg-gray-100">
                                <tr>
                                    <th scope="col" className="text-center px-2 py-3 border-r border-gray-300 w-30">Sentence ID</th>
                                    <th scope="col" className="text-center px-2 py-3 w-100">Text</th>
                                    <th scope="col" className="text-center px-2 py-3 border-l border-gray-300">AI label</th>
                                    <th scope="col" className="text-center px-2 py-3 border-l border-gray-300">Users labels</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleSentences.map((sentence, index) => (
                                    <tr key={`${sentence.sentence_id}${index}`} className="border-b border-gray-300 text-[14px]">
                                        <td className="text-center px-2 py-1">{sentence.sentence_id}</td>
                                        <td className="text-center px-2 py-1 border-l border-gray-300 arabic w-100">
                                            {sentence.sentence_text}
                                        </td>
                                        <td className="text-center px-2 py-1 border-l border-gray-300 w-30">
                                            {capitalizeFirstLetter(sentence.ai_label)}
                                        </td>
                                        <td className="text-center px-2 py-1 border-l border-gray-300 w-30">

                                            <table className="table-fixed w-full text-left">
                                                <tbody>
                                                    {sentence.annotations.map((annotator, index) => (
                                                        <tr key={index} className="align-top">
                                                            <td className="text-[14px]">
                                                                {annotator.label}:
                                                            </td>
                                                            <Tooltip placement="right" title={annotator.user_name != userData.userName? `Details` : ''}>
                                                                <td
                                                                    className="text-[14px] text-center text-blue-500 hover:text-blue-700 cursor-pointer"
                                                                    onClick={() => {
                                                                        setSelectedAnnotation({ ...sentence, ...annotator })
                                                                        if (userData.userName !== annotator.user_name) {
                                                                            openNoteDialog()
                                                                        }
                                                                        else {
                                                                            openUpdateDialog()
                                                                        }
                                                                    }}
                                                                >
                                                                    {userData.userName !== annotator.user_name ? capitalizeFirstLetter(annotator.user_name) : "Edit"}

                                                                </td>
                                                            </Tooltip>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                ))}

                                {
                                    visibleSentences.length === 0 && <h1 className="p-4">No results</h1>
                                }
                            </tbody>
                        </table>
                    </div>

                    <QuickDialog
                        openState={NoteDialogState}
                        setOpenState={() => setOpenNoteDialg(prev => !prev)}
                        component={
                            <NoteForm
                                annotationDetails={selectedAnnotation}
                                notifyChanges={notifyChanges}
                                closeDialog={() => setOpenNoteDialg(false)}
                            />
                        }
                    />

                    <QuickDialog
                        openState={UpdateDialogState}
                        setOpenState={() => setOpenUpdateDialogState(prev => !prev)}
                        component={
                            <UpdateAnnotation
                                task={task}
                                annotationDetails={selectedAnnotation}
                                notifyChanges={notifyChanges}
                                closeDialog={() => setOpenUpdateDialogState(false)}
                            />}
                    />

                    <QuickDialog
                        openState={viewNotesDialogState}
                        setOpenState={openNViewNotesDialog}
                        component={<NotesView notes={notes} />}
                    />
                    <div className="flex justify-center bg-gray-100 mt-2">
                        <TablePagination
                            component="div"
                            count={annos.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            labelRowsPerPage="Sentences per page:"
                            sx={{ margin: 'auto' }}
                        />
                    </div>
                </div>
            }
        </>
    )


}