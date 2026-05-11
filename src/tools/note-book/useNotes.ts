import { computed, ref } from 'vue';
import { categoryService } from '@/api/note/category.service';
import { noteService } from '@/api/note/note.service';

export interface Note {
  _id?: string
  id?: string
  title: string
  content: string
  category: string
  updatedAt?: string
}

export interface NoteCategory {
  _id: string
  id: string
  name: string
}

export function useNotes() {
  const categories = ref<NoteCategory[]>([]);
  const notes = ref<Note[]>([]);
  const searchNoteTitle = ref('');
  const selectedCategory = ref<string | null>(null);
  const page = ref(1);
  const pageSize = ref(10);
  const totalCount = ref(0);
  const loading = ref(false);

  const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize.value)));
  const categoryNames = computed(() => categories.value.map(category => category.name));

  async function fetchNotes() {
    loading.value = true;
    try {
      const res = await noteService.query({
        keyword: searchNoteTitle.value || undefined,
        category: selectedCategory.value || undefined,
        page: page.value - 1,
        size: pageSize.value,
      });
      notes.value = res.data || [];
      totalCount.value = Number(res.headers?.['x-total-count'] || notes.value.length);
    } finally {
      loading.value = false;
    }
  }

  async function fetchCategories() {
    const { data } = await categoryService.query();
    categories.value = data || [];
  }

  async function saveNote(note: Note) {
    const payload = {
      title: note.title,
      content: note.content || '',
      category: note.category || '未分类',
    };
    if (note._id || note.id) {
      await noteService.update((note._id || note.id)!, payload);
    } else {
      await noteService.create(payload);
    }
    await fetchNotes();
  }

  async function deleteNote(note: Note) {
    const id = note._id || note.id;
    if (!id) {
      return;
    }
    await noteService.delete(id);
    if (notes.value.length === 1 && page.value > 1) {
      page.value -= 1;
    }
    await fetchNotes();
  }

  async function addCategory(name: string) {
    const value = name.trim();
    if (!value || categories.value.some(category => category.name === value)) {
      return;
    }
    await categoryService.create({ name: value });
    await fetchCategories();
  }

  async function deleteCategory(category: NoteCategory) {
    await categoryService.delete(category._id || category.id);
    if (selectedCategory.value === category.name) {
      selectedCategory.value = null;
    }
    await Promise.all([fetchCategories(), fetchNotes()]);
  }

  function getCategoryCount(name: string) {
    return notes.value.filter(note => note.category === name).length;
  }

  return {
    categories,
    categoryNames,
    notes,
    searchNoteTitle,
    selectedCategory,
    totalPages,
    totalCount,
    page,
    pageSize,
    loading,
    fetchNotes,
    fetchCategories,
    saveNote,
    deleteNote,
    addCategory,
    deleteCategory,
    getCategoryCount,
  };
}
