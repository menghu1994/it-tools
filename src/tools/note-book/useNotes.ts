import { ref, computed, watchEffect } from 'vue';
import axios from 'axios';

export interface Note {
  id?: string;
  noteName: string;
  content: string;
  category?: string;
}

export function useNotes() {
  const cateGorys = ref<string[]>([]);
  const notes = ref<Note[]>([]);
  const searchNoteTitle = ref('');
  const page = ref(1);
  const itemPerPage = 10;

  const filterNotes = ref<Note[]>([]);
  const totalPages = computed(() => Math.ceil(filterNotes.value.length / itemPerPage));
  const showNotes = computed(() =>
    filterNotes.value.slice((page.value - 1) * itemPerPage, page.value * itemPerPage)
  );

  watchEffect(() => {
    filterNotes.value = notes.value.filter(note =>
      note.noteName.toLowerCase().includes(searchNoteTitle.value.toLowerCase())
    );
  });

  // --- Mock backend calls ---
  const fetchNotes = async () => {
    const { data } = await axios.get('/api/notes');
    notes.value = data;
  };

  const fetchCategories = async () => {
    const { data } = await axios.get('/api/categories');
    cateGorys.value = data;
  };

  const addNote = async (note: Note) => {
    const exists = notes.value.find(n => n.noteName === note.noteName);
    if (exists) {
      // update existing note
      exists.content = note.content;
      exists.category = note.category;
      await axios.put(`/api/notes/${exists.id}`, exists);
    } else {
      const { data } = await axios.post('/api/notes', note);
      notes.value.push(data);
    }
  };

  const deleteNote = async (noteIndex: number) => {
    const curIndex = (page.value - 1) * itemPerPage + noteIndex;
    const note = notes.value[curIndex];
    await axios.delete(`/api/notes/${note.id}`);
    notes.value.splice(curIndex, 1);
  };

  const addCategory = async (cate: string) => {
    if (!cate || cateGorys.value.includes(cate)) return;
    cateGorys.value.push(cate);
    await axios.post('/api/categories', { name: cate });
  };

  const deleteCategory = async (cate: string) => {
    cateGorys.value = cateGorys.value.filter(c => c !== cate);
    notes.value.forEach(note => {
      if (note.category === cate) note.category = '未分类';
    });
    await axios.delete(`/api/categories/${cate}`);
  };

  const getCateLength = (cate: string) =>
    notes.value.filter(note => note.category === cate).length;

  return {
    notes,
    cateGorys,
    searchNoteTitle,
    filterNotes,
    showNotes,
    totalPages,
    page,
    fetchNotes,
    fetchCategories,
    addNote,
    deleteNote,
    addCategory,
    deleteCategory,
    getCateLength,
  };
}
