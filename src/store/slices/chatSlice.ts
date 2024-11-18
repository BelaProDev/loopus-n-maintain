import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  nickname: string;
  selectedRoomId: string | null;
  isCreateRoomOpen: boolean;
}

const initialState: ChatState = {
  nickname: localStorage.getItem('chat_nickname') || '',
  selectedRoomId: null,
  isCreateRoomOpen: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setNickname: (state, action: PayloadAction<string>) => {
      state.nickname = action.payload;
      localStorage.setItem('chat_nickname', action.payload);
    },
    setSelectedRoom: (state, action: PayloadAction<string | null>) => {
      state.selectedRoomId = action.payload;
    },
    setCreateRoomOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateRoomOpen = action.payload;
    },
  },
});

export const { setNickname, setSelectedRoom, setCreateRoomOpen } = chatSlice.actions;
export default chatSlice.reducer;