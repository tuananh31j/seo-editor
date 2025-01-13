/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import {
  AppShell,
  Container,
  Button,
  TextInput,
  Loader,
  Skeleton,
  Stack,
  NumberInput,
} from "@mantine/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { SideMenuController } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import "./App.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function App() {
  const [title, setTitle] = useState("");
  const [tone, setTone] = useState("Professional and informative");
  const [wordCount, setWordCount] = useState<number>(1500);
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blocks, setBlocks] = useState<any>();
  const {
    audio,
    image,
    bulletListItem,
    checkListItem,
    codeBlock,
    file,
    numberedListItem,
    table,
    video,
    ...block
  } = defaultBlockSpecs;
  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...block,
    },
  });

  const editor = useCreateBlockNote({
    schema: schema,
    initialContent: blocks,
  });

  const handleSubmit = async () => {
    setLoading(true);

    const keywordsArray = keywords.split(",").map((keyword) => keyword.trim());

    const body: {
      title: string;
      thesis: string[];
      keywords: string[];
      tone: string;
      word_count: number;
    } = {
      title: title,
      thesis: [],
      keywords: keywordsArray,
      tone,
      word_count: wordCount,
    };
    const headings: string[] = editor.document
      .map((block) => {
        if (
          block.type === "heading" &&
          block.content.length > 0 &&
          block.content[0].type === "text"
        ) {
          return block.content[0].text;
        }
      })
      .filter((heading) => heading) as string[];
    body.thesis = headings;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      const blocksFromMarkdown = await editor.tryParseMarkdownToBlocks(
        data.content
      );
      setBlocks(blocksFromMarkdown);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    async function loadToHTML() {
      editor.replaceBlocks(editor.document, blocks);
    }
    loadToHTML();
  }, [blocks]);

  return (
    <AppShell>
      <AppShell.Main>
        <Container size="xl">
          <div style={{ marginBottom: "20px" }}>
            <TextInput
              placeholder="Title..."
              value={title}
              variant="unstyled"
              className="text-[#d8d2d1] text-4xl"
              size={"xl"}
              style={{
                marginTop: "10px",
                color: "#d8d2d1",
                fontSize: 100,
                placeholder: {
                  fontSize: 100,
                  fontStyle: "italic",
                },
              }}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextInput
              placeholder="Tone...(default: Professional and informative)"
              value={tone}
              variant="unstyled"
              className="text-[#d8d2d1] text-4xl"
              size={"xl"}
              style={{
                marginTop: "10px",
                color: "#d8d2d1",
                fontSize: 100,
                placeholder: {
                  fontSize: 100,
                  fontStyle: "italic",
                },
              }}
              onChange={(e) => setTone(e.target.value)}
            />
            <NumberInput
              placeholder="word count...(default: 1500)"
              value={wordCount}
              variant="unstyled"
              className="text-[#d8d2d1] text-4xl"
              size={"xl"}
              style={{
                marginTop: "10px",
                color: "#d8d2d1",
                fontSize: 100,
                placeholder: {
                  fontSize: 100,
                  fontStyle: "italic",
                },
              }}
              onChange={(e) => setWordCount(Number(e))}
            />
            <TextInput
              variant="unstyled"
              placeholder="Keywords..."
              value={keywords}
              className="text-[#d8d2d1] text-4xl"
              onChange={(e) => setKeywords(e.target.value)}
              style={{
                marginTop: "10px",
                color: "#d8d2d1",
                fontSize: 100,
                placeholder: {
                  fontSize: 100,
                  fontStyle: "italic",
                },
              }}
            />
            <Button
              onClick={handleSubmit}
              style={{
                marginTop: "10px",
                background:
                  title && keywords
                    ? "linear-gradient(45deg, #ff007f, #7f00ff, #00c9ff)"
                    : "gray", // Gradient nếu có dữ liệu
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "12px",
                padding: "12px 24px",
                border: "2px solid transparent",
                position: "fixed",
                bottom: "20px",
                right: "20px",
                overflow: "hidden",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                textTransform: "uppercase",
                opacity: title && keywords ? 1 : 0.5, // Giảm opacity nếu thiếu dữ liệu
              }}
              disabled={loading || !title || !keywords} // Disable nút nếu đang tải hoặc thiếu dữ liệu
            >
              {loading ? <Loader color={"white"} size="sm" /> : "AI Generate"}
              {loading || !title || !keywords ? null : (
                <div className="shine" />
              )}
            </Button>
          </div>

          {loading ? (
            <Stack gap="md">
              <Skeleton c={"red"} height={40} mt={6} width="50%" radius="xl" />
              <Skeleton height={30} mt={6} width="20%" radius="xl" />
              <Skeleton height={30} mt={6} width="30%" radius="xl" />
              <Skeleton height={20} mt={6} width="80%" radius="xl" />
              <Skeleton height={30} mt={6} width="40%" radius="xl" />
              <Skeleton height={30} mt={6} width="70%" radius="xl" />
              <Skeleton height={30} mt={6} width="90%" radius="xl" />
              <Skeleton height={30} mt={6} width="60%" radius="xl" />
              <Skeleton height={30} mt={6} width="30%" radius="xl" />
              <Skeleton height={30} mt={6} width="70%" radius="xl" />
              <Skeleton height={30} mt={6} width="80%" radius="xl" />
              <Skeleton height={30} mt={6} width="80%" radius="xl" />
              <Skeleton height={30} mt={6} width="40%" radius="xl" />
              <Skeleton height={30} mt={6} width="50%" radius="xl" />
              <Skeleton height={30} mt={6} width="77%" radius="xl" />
            </Stack>
          ) : (
            <BlockNoteView editor={editor} theme={"light"} sideMenu={false}>
              <div
                style={{ position: "relative", display: "flex", zIndex: 1000 }}
              >
                <SideMenuController />
              </div>
            </BlockNoteView>
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
