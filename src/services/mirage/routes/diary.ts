
import { Response, Request } from 'miragejs';
import { handleErrors } from '../server';
import { User } from '../../../Interfaces/user.interface';
import { Diary } from '../../../Interfaces/diary.interface';
import { Entry } from '../../../Interfaces/entry.interface';
import dayjs from 'dayjs';


export const create = (
  schema: any,
  req: Request
): { user: User; diary: Diary } | Response => {
  try {
    const { title, type, userId } = JSON.parse(req.requestBody) as Partial<
      Diary
    >;
    const exUser = schema.users.findBy({ id: userId });
    if (!exUser) {
      return handleErrors(null, 'No such user exists.');
    }
    const now = dayjs().format();
    const diary = exUser.createDiary({
      title,
      type,
      createdAt: now,
      updatedAt: now,
    });
    return {
      user: {
        ...exUser.attrs,
      },
      diary: diary.attrs,
    };
  } catch (error) {
    return handleErrors(error, 'Failed to create Diary.');
  }
};





export const removeDiary = (schema: any, req: Request): Diary | Response => {
  try {


    const diary = schema.diaries.find(req.params.id);
    const relatedEntries = diary.entry;
    relatedEntries.destroy();
    diary.destroy();

    return diary.attrs as Diary;
  } catch (error) {
    return handleErrors(error, 'Failed to remove Diary.');
  }
};




export const updateDiary = (schema: any, req: Request): Diary | Response => {
  try {
    const diary = schema.diaries.find(req.params.id);
    const data = JSON.parse(req.requestBody) as Partial<Diary>;
    const now = dayjs().format();
    diary.update({
      ...data,
      updatedAt: now,
    });
    return diary.attrs as Diary;
  } catch (error) {
    return handleErrors(error, 'Failed to update Diary.');
  }
};

export const getDiaries = (schema: any, req: Request): Diary[] | Response => {
  try {
    const user = schema.users.find(req.params.id);
    return user.diary as Diary[];
  } catch (error) {
    return handleErrors(error, 'Could not get user diaries.');
  }
};




export const addEntry = (
  schema: any,
  req: Request
): { diary: Diary; entry: Entry } | Response => {
  try {
    const diary = schema.diaries.find(req.params.id);
    const { title, content } = JSON.parse(req.requestBody) as Partial<Entry>;
    const now = dayjs().format();
    const entry = diary.createEntry({
      title,
      content,
      createdAt: now,
      updatedAt: now,
    });
    diary.update({
      ...diary.attrs,
      updatedAt: now,
    });
    return {
      diary: diary.attrs,
      entry: entry.attrs,
    };
  } catch (error) {
    return handleErrors(error, 'Failed to save entry.');
  }
};

export const getEntries = (
  schema: any,
  req: Request
): { entries: Entry[] } | Response => {
  try {
    const diary = schema.diaries.find(req.params.id);
    return diary.entry;
  } catch (error) {
    return handleErrors(error, 'Failed to get Diary entries.');
  }
};

export const updateEntry = (schema: any, req: Request): Entry | Response => {
  try {
    const entry = schema.entries.find(req.params.id);
    const data = JSON.parse(req.requestBody) as Partial<Entry>;
    const now = dayjs().format();
    entry.update({
      ...data,
      updatedAt: now,
    });
    return entry.attrs as Entry;
  } catch (error) {
    return handleErrors(error, 'Failed to update entry.');
  }
};

/*
 
export const removeEntry = (schema: any, req: Request): Entry | Response => {
  try {
 
    const data = JSON.parse(req.requestBody) as Partial<Entry>;
    console.log( req.requestBody)
    const diary = schema.diaries.find(req.params.id);
    let entry = diary.entry.filter((ent: Entry) => ent.id === data.id);
    entry.destroy();
 return entry
    //return entry.attrs as Entry;
  } catch (error) {
    return handleErrors(error, 'Failed to remove entry.');
  }
};
 
*/


export const removeEntry = (schema: any, req: Request): Entry | Response => {
  try {

    const diary = schema.diaries.find(req.params.id);
    let entryId = req.params.id1;
    let entry = diary.entry.filter((ent: Entry) => ent.id === entryId);
    entry.destroy();
    return entry
    //return entry.attrs as Entry;
  } catch (error) {
    return handleErrors(error, 'Failed to remove entry.');
  }
};
