import client from "./client";

// enterInviteLink(token, payload)

// POST /api/v1/invite-links/{token}/enter
export const enterInviteLink = async (token, { name, password }) => {
    const response = await client.post(`/invite-links/${token}/enter`, {
        name,
        password,
    });

    return response.data;
};