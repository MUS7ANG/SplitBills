import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PostDetail from "../components/post";
import { IPost } from "../types";
import { getPost } from "../api/posts";
import { useAuthStore } from "../store/useAuthStore.ts";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    Typography,
} from "@mui/material";

const PostPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<IPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user, profile } = useAuthStore();

    useEffect(() => {
        if (!user || profile?.role !== "user") {
            setError("У вас недостаточно прав для просмотра этого поста.");
        }
    }, [user, profile]);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id || error) return;
            setLoading(true);
            try {
                const data = await getPost(id);
                if (data) {
                    setPost(data);
                } else {
                    setError("Пост не найден");
                }
            } catch (err) {
                console.error("Error fetching post:", err);
                setError("Ошибка при загрузке поста");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, error]);
    console.log("PostDetail received:", post);

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Пост
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading && (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                )}

                {!loading && !error && !post && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Пост не найден
                    </Alert>
                )}

                {!loading && !error && post && <PostDetail post={post} />}

                <Box
                    sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/")}
                        disabled={loading}
                    >
                        Назад
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default PostPage;