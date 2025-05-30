import { Divider, Avatar } from "@mui/material";
import _ from "lodash";

const formatDateToLong = (dateString) => {
    const date = new Date(dateString)
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date)
}

export default function NotesView({ notes }) {

    const groupedNotes = _.groupBy(notes, 'sentenceId');


    let formattedGroupedNotes = _.mapValues(groupedNotes, (items) => ({
        sentenceText: items[0].sentenceText,
        notes: items.map(({ notedBy, noteContent, createdAt }) => ({ notedBy, noteContent, createdAt }))
    }));

    formattedGroupedNotes = Object.entries(formattedGroupedNotes).map(([sentenceId, data]) => ({
        sentenceId,
        ...data
    }))

    return (
        <div className="flex flex-col justify-center gap-2 w-[800px] overflow-auto">
            <h1 className="text-[14px]">You have {notes.length} notes for {formattedGroupedNotes.length} annotations</h1>
            {
                formattedGroupedNotes.map((note, index) => (
                    <div key={index + 20} className="flex flex-col gap-2">
                        <div className="p-5 bg-gray-100" key={index}>
                            <h1 className="text-right text-[14px]" key={index + 1}>{note.sentenceText} </h1>
                        </div>
                        {
                            note.notes.map((noteDetail, idx) => (
                                <div key={idx + 30}>
                                    <div className="flex items-center gap-1" key={idx + 31}>
                                        <Avatar key={idx + 2} sx={{ width: '30px', height: '30px' }}>{noteDetail.notedBy.charAt(0)}</Avatar>
                                        <h1 key={idx + 39} className="text-[14px]">{noteDetail.notedBy}</h1>
                                    </div>
                                    <h1 key={idx + 40} className="text-[14px] text-right">{noteDetail.noteContent}</h1>
                                    <h1 className="text-[12px] text-gray-500" key={idx+39}>{formatDateToLong(noteDetail.createdAt)}</h1>
                                    <Divider sx={{ mt: 1 }} key={idx+0} />
                                </div>
                            ))
                        }


                    </div>

                ))
            }
            {
                formattedGroupedNotes.length === 0 && (
                    <h1 className="text-left text-[14px]">No notes available</h1>
                )
            }

        </div>
    );
}