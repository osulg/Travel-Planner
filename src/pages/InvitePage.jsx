import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function InvitePage() {
    const { inviteToken } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!inviteToken) {
            navigate("/");
            return;
        }

        // 탭별로만 유지
        sessionStorage.setItem("pendingInviteToken", inviteToken);

        // 이건 공유되어도 큰 문제 없음
        localStorage.setItem("homeActiveTab", "myTrips");

        navigate("/");
    }, [inviteToken, navigate]);

    return null;
}

export default InvitePage;