import {createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { server } from '@/components/constants/config.js';

const api = createApi({
    reducerPath : "api",
    baseQuery: fetchBaseQuery({baseUrl: `${server}/api/`,
        credentials: "include",
    }),
    tagTypes: ["Chat", "User", "Message", "Friends"],
    endpoints: (builder) => ({
        myChats: builder.query({
            query: () => ({
                url:"chat/myChats",
               
            }),
            providesTags:["Chat"],
        }),
       
        myGroups: builder.query({
            query: () => ({
                url: "chat/myGroups",

            }),
            providesTags: ["Chat"],
        }),

        searchUser: builder.query({
            query: (name) => ({
                url: `user/searchUser?name=${name}`,

            }),
            providesTags: ["User"],
        }),

        sendFriendRequest: builder.mutation({
            query: (data) => ({
                url:"user/sendFriendRequest",
                method: "PUT",
                body:data,
            }),
            invalidatesTags:["User"],
        }),

        chatDetails: builder.query({
            query: ({ chatId, populate = false }) => {
                let url = `chat/${chatId}`;

                if (populate) url += "?populate=true";

                return {
                    url,
                    credentials: "include",
                };
            },
            providesTags: ["Chat"],
        }),

        getMessages: builder.query({
            query: ({ chatId, page = 1 }) => ({
                url: `chat/getMessage/${chatId}?page=${page}`,
                credentials: "include",
            }),
           keepUnusedDataFor:0,
        }),

        myAvailableFriends: builder.query({
            query: (chatId) => {
                let url = "user/friends";

                if (chatId) url += `?chatId=${chatId}`;

                return { url };
            },
            keepUnusedDataFor: 0,
        }),

        newGroup: builder.mutation({
            query: (data) => ({
                url: "user/sendFriendRequest",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),

        removeGroupMember: builder.mutation({
            query: ({chatId , userId}) => ({
                url: "chat/removeMember",
                method: "PUT",
                body: {chatId , userId},
            }),
            invalidatesTags: ["Chat"],
        }),

        addGroupMember: builder.mutation({
            query: ({ members , chatId }) => ({
                url: "chat/addMembers",
                method: "PUT",
                body: { members, chatId },
            }),
            invalidatesTags: ["Chat"],
        }),
        
       deleteChat: builder.mutation({
            query: ({  chatId  }) => ({
               url: `chat/deleteChat/${chatId}`,
                method: "DELETE",
               
            }),
            invalidatesTags: ["Chat"],
        }),
        leaveGroup: builder.mutation({
            query: ({ chatId }) => ({
                url: `chat/leaveGroup/${chatId}`,
                method: "PUT",

            }),
            invalidatesTags: ["Chat"],
        }),
    }),
})

export default api;
export const { useMyChatsQuery ,
     useLazySearchUserQuery ,
     useSendFriendRequestMutation,
    useChatDetailsQuery,
    useGetMessagesQuery,
   useMyGroupsQuery,
   useMyAvailableFriendsQuery,
   useRemoveGroupMemberMutation,
   useAddGroupMemberMutation,
   useDeleteChatMutation,
   useLeaveGroupMutation,

    } = api;