import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Loader from '../../Loaders/Loader'
import { Button, TablePagination, Alert, IconButton, Tooltip, Badge } from "@mui/material";
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
axios.defaults.withCredentials = true;
const formatDateToLong = (dateString) => {

    const date = new Date(dateString)
    const options = { day: 'numeric', month: 'long', year: 'numeric' }
    return new Intl.DateTimeFormat('en-GB', options).format(date)

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

    const [anyChanges, setAnyChanges] = useState(1)
    const [alertMsg, setAlertMsg] = useState({
        isError: false, message: null
    })
    const notifyChanges = (feedback) => {
        setAnyChanges(prev => prev + 1)
        setAlertMsg(feedback)
    }

    const openUpdateDialog = (event, sentence) => {

        setSentenceToUpdate(sentence)
        setOpenUpdateDialogState(prev => !prev)

    }


    const [senetenceToUpdate, setSentenceToUpdate] = useState()

    const [note, setNote] = useState({
        text: "",
        userId: "",
        userName: "",
        sentenceId: "",
        sentenceText: "",
        label: ""
    })


    const openNoteDialog = (event, annotation) => {

        const { user_id, name } = annotation.annotated_by
        const { sentence_id, text, label } = annotation

        setNote({
            ...note,
            userId: user_id,
            sentenceId: sentence_id,
            userName: name,
            sentenceText: text,
            label
        })
        setOpenNoteDialg(prev => !prev)

    }

    const openNViewNotesDialog = () => {
        setOpenViewNotesDialogState(prev => !prev)
    }

    const handleNoteChange = (event) => {
        setNote({ ...note, text: event.target.value })
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
            const url1 = `${import.meta.env.VITE_API_URL}/annotation/${task.task_id}/viewannotatedsentences`
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
                    setAlertMsg({ isError: true, message: ResponseMessage.INTERNAL_SERVER_ERROR_MSG })
                }
            } finally {
                setLoading(false)
            }

        }
        getAllAnnotations()
    }, [anyChanges])


    return (
        <>
            {loading ? <Loader /> :
                <div className="w-[800px]">

                    <div className="mt-3 flex justify-end text-[14px] pr-3">
                        <Tooltip title="Show notes">
                            <Badge color="secondary" badgeContent={notes.length} showZero>
                                <IconButton onClick={openNViewNotesDialog}>
                                    <QuestionAnswerOutlinedIcon fontSize="small" sx={{ color: 'red' }} />
                                </IconButton>
                            </Badge>
                        </Tooltip>
                    </div>

                    <div id="filter">
                        <h1 className="mb-2">Filter</h1>
                        <Filter filterData={sentencesFilter} data={annos} setSearchResult={setFilteredAnnos} />
                    </div>

                    <div className="mt-2">
                        {alertMsg.message && <Alert severity={alertMsg.isError ? 'error' : 'success'}>{alertMsg.message}</Alert>}
                    </div>


                    <div className=" overflow-y-auto mt-3">
                        <table className="min-w-full h-[450px] border border-gray-300 relative" style={{ padding: '10px' }}>
                            <thead className="text-[15px] bg-gray-100">
                                <tr>
                                    <th scope="col" className="text-center px-2 py-3 border-r border-gray-300">Annotated by</th>
                                    <th scope="col" className="text-center px-2 py-3">Text</th>
                                    <th scope="col" className="text-center px-2 py-3 border-l border-gray-300">Annotated at</th>
                                    <th scope="col" className="text-center px-2 py-3 border-l border-gray-300">Label</th>
                                    <th scope="col" className="text-center px-2 py-3 border-l border-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleSentences.map((sentence, index) => (
                                    <tr key={`${sentence.sentence_id}${index}`} className="border-b border-gray-300 text-[14px]">
                                        <td className="text-center px-2 py-1 border-r border-gray-300 w-40">{sentence.annotated_by.name}</td>
                                        <td className="text-center px-2 py-1">{sentence.text}</td>
                                        <td className="text-center px-2 py-1 border-l border-gray-300 w-30">{formatDateToLong(sentence.created_at)}</td>
                                        <td className="text-center px-2 py-1 border-l border-gray-300 w-30">
                                            {sentence.label}
                                        </td>
                                        <td className="text-center px-2 py-1 border-l border-gray-300 w-30">
                                            <div>

                                            {
                                                userData.userName === sentence.annotated_by.name ?
                                                    <h1 style={{ cursor: 'pointer' }} className="text-blue-400 hover:text-blue-800"
                                                        onClick={(event) => openUpdateDialog(event, sentence)}
                                                    > Edit
                                                    </h1>
                                                    :
                                                    <h1 style={{ cursor: 'pointer' }} className="text-blue-400 hover:text-blue-800"
                                                        onClick={(event) => openNoteDialog(event, sentence)}
                                                    > Add note
                                                    </h1>
                                            }
                                            </div>

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
                                handleChange={handleNoteChange}
                                note={note}
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
                                sentence={senetenceToUpdate}
                                notifyChanges={notifyChanges}
                                closeDialog={() => setOpenUpdateDialogState(false)}
                            />}
                    />

                    <QuickDialog
                        openState={viewNotesDialogState}
                        setOpenState={openNViewNotesDialog}
                        component={ <NotesView notes={notes} />}
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