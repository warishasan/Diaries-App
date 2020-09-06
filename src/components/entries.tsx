import React from 'react';
import { useSelector } from "react-redux"
import store from '../store';
import { fetchEntriesData } from '../features/entry/entriesSlice'
import { Entry } from '../Interfaces/entry.interface';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { useForm } from 'react-hook-form';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import http from '../services/api';
import { Diary } from '../Interfaces/diary.interface';
import CircularProgress from '@material-ui/core/CircularProgress';
import { showAlert } from '../util';



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff"
    },
    wrapperEntries: {
      backgroundColor: "lightBlue",
      width: "100vh",
      maxWidth: "100vw",
      marginTop: "2vh",
      borderStyle: "solid",
      borderRadius: "10px"
    },
    entriesHeading: {
      color: "white",
      fontSize: "4vh",
      textShadow: "2px 5px 10px grey",
      marginLeft: "1vh",
      marginRight: "1vh",
      overflow: 'auto',
      paddingBottom: "1vh"


    },
    entryAddButton: {
      marginLeft: "1vh",
      backgroundColor: "orange"
    },
    divider: {
      height: "0.5vh",
      backgroundColor: "white"
    },
    diaryList: {
      height: "60vh",
      maxHeight: "60vh",
      overflow: 'auto'
    },
    diaryListItemWrapper: {

      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: "100%",
      textAlign: "center",
      alignContent: "center",
      backgroundColor: "white",
      borderStyle: "solid",
      borderRadius: "10px"
    },
    entryEditButton: {
      marginLeft: "1vh",
    },
    listItemEntryTitle: {

      fontSize: "3vh",
      marginLeft: "1vh",
      marginRight: "1vh",
      overflow: 'auto',
      paddingBottom: "1.5vh",
      textShadow: "2px 5px 10px grey"

    },
    entryDateWrapper: {
      display: "flex",
      flexDirection: "column",
      marginLeft: "1vh",
      marginRight: "1vh",
      marginTop: "-2vh"
    },
    entryDateInnerWrapper: {
      disply: "flex",
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: "2vh"
    },
    entryDateHeading: {
      fontSize: "1.5vh",
      fontWeight: "bold",
      textDecoration: "underline"
    },
    entryDateContent: {
      fontSize: "1.5vh",
    },
    diaryListItemContent: {

      fontSize: "2vh",
      textAlign: "left",
      marginLeft: "1vh",
      marginRight: "1vh",
      overflow: "auto",
      padding: "1vh"
    },
    entryEditorWrapper: {
      backgroundColor: "lightBlue",
      display: "flex",
      flexDirection: "column",
      width: "80vw",
      height: "80vh",
      borderStyle: "solid",
      borderRadius: "10px"
    },
    entryEditorHeadings: {
      fontSize: "4vh",
      textAlign: "center",
      fontWeight: "bold",
      textShadow: "2px 5px 10px grey",
      textDecoration: "underline",
      color: "black",


    },
    entryEditorTitleInput: {
      width: "80%",
      height: "4vh",
      fontSize: "3vh",
      borderStyle: "solid",
      borderRadius: "10px",
      padding: "1vh"
    },
    entryEditorContentInput: {
      width: "90%",
      maxWidth: "90%",
      height: "200%",
      fontSize: "2vh",
      borderStyle: "solid",
      borderRadius: "10px",
      resize: "none",
      padding: "1vh"
    },
    entryEditorButtonsWrapper: {

      display: "flex",
      flexDirection: "row",
      marginTop: "35vh",
      justifyContent: "space-around",
      marginLeft: "9vw",
      marginRight: "9vw"

    },
    entryEditorButtons: {
      width: "18vw",
      fontSize: "2vh",
      borderRadius: "10px",
      fontFamily: "Arial, Helvetica, sans-serif",
      backgroundColor: "white",
      '&:hover': {
        backgroundColor: "darkGrey"

      }
    },
    entryEditorSaveButton: {
      width: "18vw",
      fontSize: "2vh",
      borderRadius: "10px",
      fontFamily: "Arial, Helvetica, sans-serif",
      backgroundColor: "orange",
      '&:hover': {
        backgroundColor: "darkGrey"

      }
    },
    entryDeleteWrapper: {
      backgroundColor: "lightBlue",
      display: "flex",
      flexDirection: "column",
      width: "80vw",
      height: "40vh",
      borderStyle: "solid",
      borderRadius: "10px",
      paddingTop: "11vh",

    },
    entryDeleteText: {
      color: "black",
      fontSize: "4vh",
      textAlign: "center",
      marginBottom: "-20vh"
    },
    entryDeleteButtonsWrapper: {

      display: "flex",
      flexDirection: "row",
      marginTop: "35vh",
      justifyContent: "space-around",
      marginLeft: "9vw",
      marginRight: "9vw"

    },

    entryDeleteButtons: {
      width: "18vw",
      fontSize: "2vh",
      borderRadius: "10px",
      fontFamily: "Arial, Helvetica, sans-serif",
      backgroundColor: "white",
      '&:hover': {
        backgroundColor: "darkGrey"

      }
    },
    loader: {
      marginTop: "2vh",
      textAlign: "center",
      marginBottom: "1vh"

    },
    error: {
      textAlign: "center"
    }


  })

);



function Entries() {
  const classes = useStyles();


  const [addUpdate, setAddUpdate] = React.useState<"add" | "update">("add")
  const { selectedDiary, entries } = useSelector((state: any) => state);
  const [openBackDrop, setOpenBackDrop] = React.useState(false);
  const [fetchData, setFetchData] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [updateEntry, setUpdateEntry] = React.useState<Entry>();

  const [newTitle, setNewTitle] = React.useState<string>();
  const [newContent, setNewContent] = React.useState<string>();
  const [deletePrompt, setDeletePrompt] = React.useState(false);


  console.log(selectedDiary)




  const { handleSubmit, register} = useForm<Entry>();

  React.useEffect(() => {

    if (selectedDiary !== null || fetchData) {

      store.dispatch(fetchEntriesData(selectedDiary.id))

      if (fetchData) {
        setFetchData(false);
      }

    }

  }, [selectedDiary, fetchData])



  const handleYesButton = () => {

    setOpenBackDrop(false)
    setDeletePrompt(false);
    console.log(updateEntry)

    http
      .delete<Partial<Entry>, Entry | Response>(`/diaries/entries/${selectedDiary?.id!}/${updateEntry?.id!}`)
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



  const handleDeleteButton = () => {

    setDeletePrompt(true);

  }

  const handleCancelButton = () => {

    setOpenBackDrop(false)
    setDeletePrompt(false);

  }


  const handleNewEntry = () => {

    setOpenBackDrop(true)
    setAddUpdate("add")
    setNewTitle("")
    setNewContent("")

  }


  const handleEditEntry = (entry: Entry) => {

    setOpenBackDrop(true)
    setAddUpdate("update")
    setUpdateEntry(entry)
    setNewTitle(entry.title)
    setNewContent(entry.content)

  }




  const submitForm = (data: Entry) => {
    setDeletePrompt(false);
    setOpenBackDrop(false);
    setLoading(true);

    if (addUpdate === "add") {

      let title: string = data.title
      let content: string = data.content

      if (data.title === "") {

        title = "Unnamed Entry"
      }

      if (data.content === "") {

        content = "No content entered ...."
      }


      http
        .post<Entry, { diary: Diary; entry: Entry } | Response>(`/diaries/entry/${selectedDiary.id}`, { title: title, content: content })
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
        .put<Entry, Entry | Response>(`/diaries/entry/${updateEntry?.id}`, { title: data.title, content: data.content })
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




  }


  if (entries.error) {

    return (
      <h1 className={classes.error}>There was an unexpected error while fetching entries from the server</h1>
    )
  }

  return (
    <div>




      <div className={classes.wrapperEntries}>

        {!!selectedDiary &&

          <h2 className={classes.entriesHeading}>Entries in "{selectedDiary.title}" <Fab onClick={handleNewEntry} size="small" className={classes.entryAddButton} color="primary" aria-label="add">
            <AddIcon />
          </Fab></h2>
        }
        {!!selectedDiary && <Divider className={classes.divider} variant="middle" />}



        {(!!selectedDiary && !entries.isLoading && !loading) ?





          <List className={classes.diaryList} component="nav" aria-label="main mailbox folders">
            {entries.entries.map((entry: Entry, ind: number) => {

              return (

                <ListItem key={ind} >
                  <div className={classes.diaryListItemWrapper}>
                    <h3 className={classes.listItemEntryTitle} >{entry.title}     <Fab onClick={() => handleEditEntry(entry)} className={classes.entryEditButton} size="small" color="secondary" aria-label="add" >
                      <EditIcon />
                    </Fab> </h3>
                    <div className={classes.entryDateWrapper}>
                      {!!entry.createdAt && <div className={classes.entryDateInnerWrapper}><span className={classes.entryDateHeading}>Created: </span>  <span className={classes.entryDateContent}> {entry.createdAt!.slice(0, 10)}, {entry.createdAt!.slice(11, 19)} </span></div>}
                      {(!!entry.updatedAt && (entry.updatedAt !== entry.createdAt)) && <div className={classes.entryDateInnerWrapper} ><span className={classes.entryDateHeading} >Updated: </span>  <span className={classes.entryDateContent} >{entry.updatedAt!.slice(0, 10)}, {entry.updatedAt!.slice(11, 19)} </span></div>}
                    </div>
                    <Divider variant="middle" />

                    <p className={classes.diaryListItemContent}>{entry.content}</p>

                  </div>
                </ListItem>

              )
            })}
          </List>

          :

          (entries.isLoading || loading) ?
            <div className={classes.loader}><CircularProgress /></div>
            :
            <h2 className={classes.entriesHeading}>Please select a diary to view its entries</h2>


        }

        <Backdrop className={classes.backdrop} open={openBackDrop} >

          {deletePrompt ? <div className={classes.entryDeleteWrapper}>

            <p className={classes.entryDeleteText} >Are you sure you want to delete {updateEntry?.title}?</p>
            <div className={classes.entryDeleteButtonsWrapper}>

              <Button className={classes.entryDeleteButtons} onClick={handleYesButton}  >YES</Button>

              <Button className={classes.entryDeleteButtons} onClick={() => { setDeletePrompt(false) }} >NO</Button>

              <Button className={classes.entryDeleteButtons} onClick={handleCancelButton} >CANCEL</Button>
            </div>

          </div> :



            <form onSubmit={handleSubmit(submitForm)}>
              <div className={classes.entryEditorWrapper}>
                <label> <h2 className={classes.entryEditorHeadings}>Title</h2>
                  <input className={classes.entryEditorTitleInput} value={newTitle} name="title" ref={register} type="text" onChange={(e) => setNewTitle(e.target.value)}></input>
                </label>

                <label>  <h2 className={classes.entryEditorHeadings} >Content</h2>
                  <textarea className={classes.entryEditorContentInput} value={newContent} ref={register} name="content" onChange={(e) => setNewContent(e.target.value)} ></textarea>
                </label>

                <div className={classes.entryEditorButtonsWrapper}>
                  <input className={classes.entryEditorSaveButton} name="submit" ref={register} type="submit" value="SAVE" ></input>

                  <Button onClick={handleCancelButton} className={classes.entryEditorButtons}  >CANCEL</Button>
                  {addUpdate === "update" &&
                    <Button onClick={handleDeleteButton} className={classes.entryEditorButtons} >DELETE</Button>
                  }
                </div>
              </div>
            </form>
          }
        </Backdrop>



      </div>





    </div>
  );



}

export default Entries;


