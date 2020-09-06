import React from 'react';
import { useSelector } from "react-redux"
import { User } from '../Interfaces/user.interface';
import { Diary } from '../Interfaces/diary.interface';
import { removeEntries } from '../features/entry/entriesSlice'
import store from '../store';
import { fetchDiaryData } from '../features/diary/diariesSlice'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import http from '../services/api';
import { selectDiary } from '../features/diary/diarySelectedSlice'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import { showAlert } from '../util';




const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        diaryWrapper: {
            backgroundColor: "rgba(48,133,214,1)",
            width: "75vh",
            maxWidth: "100vw",
            borderStyle: "solid",
            marginTop: "2vh",
            borderRadius: "10px"

        },
        diaryHeading: {
            color: "white",
            fontSize: "4vh",
            textShadow: "2px 5px 10px grey",
            paddingBottom: "1vh"

        },
        divider: {
            height: "0.5vh",
            backgroundColor: "white"
        },
        diaryAddButton: {
            marginLeft: "1vh",
            backgroundColor: "orange"
        },
        diaryList: {
            height: "60vh",
            maxHeight: "60vh",
            overflow: 'auto'
        },
        diaryListItem: {
            backgroundColor: "lightBlue",
            width: "85%",
            //margin: "1vh auto",
            borderRadius: "10px",
            borderStyle: "solid",
            borderWidth: "2px",
            '&:hover': {
                backgroundColor: "white"

            },
            '&:focus': {
                backgroundColor: "white"

            },
        },
        diaryListItemWrapper: {

            display: "flex",
            flexDirection: "row",
            margin: "2vh",
            justifyContent: "space-around",
            alignItems: "center",

        },
        selectedDiaryListItem: {
            backgroundColor: "white",
            width: "85%",
            //margin: "1vh auto",
            borderRadius: "10px",
            borderStyle: "solid",
            borderWidth: "2px",
            '&:hover': {
                backgroundColor: "white"

            },
        },
        dialogBoxWrapper: {
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            marginTop: 0
        },


        dialogBoxTitle: {
            fontSize: "5vh",
            marginLeft: "2vh",
            marginRight: "2vh",
            textDecoration: "underline"
        },

        dialogTitleHeading: {
            fontSize: "3vh",
            color: "black",
            textAlign: "left"


        },
        dialogTitleInput: {
            fontSize: "2vh",
            marginBottom: "2vh",
        },
        dialogButtons: {

            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: "4vh",
            marginBottom: "2vh",

        },
        dialogButtonStyle: {
            fontSize: "2vh"
        },
        loader: {

            textAlign: "center",
            marginBottom: "1vh"

        },

        diaryListItemTitle: {

            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "90%",
            maxWidth: "90%",
            fontSize: "3vh",
            fontWeight: "bold"
        },
        listItemContentWrapper: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",

        },

        diaryListItemType: {

            color: "purple",
            fontWeight: "bold"
        },
        listItemContentInnerWrapper: {
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            width: "70%",


        },

        diaryListItemDate: {
            fontSize: "1.5vh",
            marginTop: "-2vh"
        },
        error: {
            textAlign: "center"
        }

    }),
);

function Dashbaord() {
    const classes = useStyles();


    const { user, diaries, selectedDiary } = useSelector((state: any) => state);

    const [fetchData, setFetchData] = React.useState(true);
    const [addUpdate, setAddUpdate] = React.useState<"add" | "update">("add");
    const [openDialog, setOpenDialog] = React.useState(false);
    const [updateDiary, setUpdateDiary] = React.useState<Diary>();
    const [newTitle, setNewTitle] = React.useState<string>("");
    const [newType, setNewType] = React.useState<"public" | "private">("public");

    const [deletePrompt, setDeletePrompt] = React.useState(false);
    const [loading, setLoading] = React.useState(false);



    React.useEffect(() => {


        if (fetchData === true) {
            store.dispatch(fetchDiaryData(user.user.id));
        }
        setFetchData(false)


    }, [fetchData,user.user.id])

    const addDiaryCallback = () => {

        setAddUpdate("add");
        setOpenDialog(true);
        setNewTitle("");
        setNewType("public")
        setDeletePrompt(false);
    }

    const editDiaryCallback = (diary: Diary) => {

        setAddUpdate("update");
        setOpenDialog(true)
        setUpdateDiary(diary)
        setNewTitle(diary.title);
        setNewType(diary.type);
        setDeletePrompt(false);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);


    };

    const handleDeleteButton = () => {

        setDeletePrompt(true);

    }

    const handleDeleteNo = () => {

        setDeletePrompt(false)
    }


    const handleDeleteYes = () => {
        store.dispatch(removeEntries())
        setOpenDialog(false);
        setLoading(true)

        http
            .delete<null, Diary | Response>(`/diaries/${updateDiary?.id!}`)
            .then((res) => {
                if (res) {
                    console.log(res)
                    setFetchData(true)
                    if (selectedDiary !== null && (updateDiary?.id === selectedDiary.id)) {

                        store.dispatch(selectDiary(null))
                    }
                }

            })
            .catch((error) => {
                console.log(error);
                showAlert(error.response.data.data.message, 'error');

            })
            .finally(() => {
                setLoading(false)
            });




    }

    const handleDoneDialog = () => {
        setOpenDialog(false);
        setLoading(true);

        let title: string = newTitle;

        if (newTitle === "") {

            title = "(Unnamed Diary)"
        }

        if (addUpdate === "add") {

            http
                .post<Diary, { user: User; diary: Diary } | Response>("/diaries/", { title: title, type: newType, userId: user.user.id })
                .then((res) => {
                    if (res) {
                        console.log(res)
                        setFetchData(true)
                    }

                })
                .catch((error) => {
                    console.log(error);
                    showAlert(error.response.data.data.message, 'error');

                })
                .finally(() => {
                    setLoading(false)
                });



        }


        if (addUpdate === "update") {

            http
                .put<string, Diary>(`/diaries/${updateDiary?.id!}`, { ...updateDiary, title: title, type: newType })
                .then((res) => {
                    if (res) {
                        console.log(res)
                        setFetchData(true)

                        if (selectedDiary !== null && (updateDiary?.id === selectedDiary.id)) {

                            store.dispatch(selectDiary(res))

                        }
                    }

                })
                .catch((error) => {
                    console.log(error);
                    showAlert(error.response.data.data.message, 'error');

                })
                .finally(() => {
                    setLoading(false)
                });



        }

    }

    



    if (diaries.error) {

        return (

            <div>
                <h1 className={classes.error}>There was an unexpected error while fetching diaries from the server</h1>
            </div>
        )
    }

    else {

        return (
            <div className={classes.diaryWrapper}>

                <h2 className={classes.diaryHeading} >My Diaries
            <Fab onClick={addDiaryCallback} size="small" className={classes.diaryAddButton} color="primary" aria-label="add">
                        <AddIcon />
                    </Fab>
                </h2>

                {(loading || diaries.isLoading) && <div className={classes.loader}><CircularProgress /></div>}




                <Divider className={classes.divider} variant="middle" />



                <List className={classes.diaryList} component="nav" aria-label="main mailbox folders">
                    {diaries.diary.map((diary: Diary, ind: number) => {

                        return (
                            <div key={ind} className={classes.diaryListItemWrapper}>
                                <ListItem className={selectedDiary?.id === diary.id ? classes.selectedDiaryListItem : classes.diaryListItem} onClick={() => store.dispatch(selectDiary(diary))} button>


                                    <div className={classes.listItemContentWrapper}>
                                        <div className={classes.listItemContentInnerWrapper}>
                                            <p className={classes.diaryListItemTitle}> {diary.title} </p>

                                            {(!!diary.updatedAt || !!diary.createdAt) &&

                                                <p className={classes.diaryListItemDate}>{diary.updatedAt !== diary.createdAt ? "Updated on: " + diary.updatedAt!.slice(0, 10) : "Created on: " + diary.createdAt!.slice(0, 10)}</p>
                                            }
                                        </div>
                                        <p className={classes.diaryListItemType}>{diary.type}</p>
                                    </div>




                                </ListItem>

                                <Fab onClick={() => { editDiaryCallback(diary) }} size="small" color="secondary" aria-label="add">
                                    <EditIcon />
                                </Fab>

                            </div>
                        )
                    })}
                </List>





                <Dialog className={classes.dialogBoxWrapper} open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">



                    <DialogTitle id="form-dialog-title"><p className={classes.dialogBoxTitle}>{deletePrompt ? "Are you sure you want to delete (" + updateDiary?.title + ")" : addUpdate === "add" ? "Add New Diary" : "Update Diary"}</p></DialogTitle>


                    {!deletePrompt &&
                        <DialogContent>
                            <div >
                                <DialogContentText className={classes.dialogTitleHeading} >
                                    Enter Title
          </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="title"
                                    type="text"
                                    fullWidth
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    value={newTitle}
                                    className={classes.dialogTitleInput}

                                />
                                <RadioGroup row={true} value={newType} aria-label="type" name="type" onChange={(e) => ((e.target.value === "public" || e.target.value === "private") && setNewType(e.target.value))} >
                                    <FormControlLabel value="public" control={<Radio />} label="public" />
                                    <FormControlLabel value="private" control={<Radio />} label="private" />


                                </RadioGroup>



                            </div>

                        </DialogContent>

                    }
                    <DialogActions  >

                        <div className={classes.dialogButtons} >

                            <Button className={classes.dialogButtonStyle} onClick={handleCloseDialog} color="primary">
                                Cancel
          </Button>


                            {(addUpdate === "update" && !deletePrompt) &&
                                <Button className={classes.dialogButtonStyle} onClick={handleDeleteButton} color="primary">
                                    Delete
         </Button>

                            }
                            {!deletePrompt &&

                                <Button className={classes.dialogButtonStyle} onClick={handleDoneDialog} color="primary">
                                    Done
          </Button>
                            }


                            {deletePrompt && (

                                <div>
                                    <Button className={classes.dialogButtonStyle} onClick={handleDeleteYes} color="primary">
                                        Yes
</Button>

                                    <Button className={classes.dialogButtonStyle} onClick={handleDeleteNo} color="primary">
                                        No
          </Button>
                                </div>
                            )

                            }

                        </div>
                    </DialogActions>
                </Dialog>






            </div>


        )
    }
}
export default Dashbaord;
