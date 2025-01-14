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
  Divider,
  SimpleGrid,
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
  const [language, setLanguage] = useState("tiếng Việt");
  const [tone, setTone] = useState("Professional and informative");
  const [wordCount, setWordCount] = useState<number>(1500);
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blocks, setBlocks] = useState<any>();
  const { paragraph, heading } = defaultBlockSpecs;
  const schema = BlockNoteSchema.create({
    blockSpecs: {
      paragraph,
      heading,
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
      sections: string[];
      keywords: string[];
      tone: string;
      word_count: number;
      language: string;
    } = {
      title: title,
      sections: [],
      keywords: keywordsArray,
      tone,
      word_count: wordCount,
      language,
    };
    const headings: string[] = editor.document
      .map((block) => {
        if (block.content.length > 0 && block.content[0].type === "text") {
          return block.content[0].text;
        }
      })
      .filter((heading) => heading) as string[];
    body.sections = headings;

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
  }, [blocks, editor]);

  return (
    <AppShell>
      <AppShell.Main>
        <Container size="xl">
          <div>
            <TextInput
              placeholder="Title..."
              value={title}
              label="Title"
              withAsterisk
              size={"xl"}
              onChange={(e) => setTitle(e.target.value)}
            />
            <SimpleGrid cols={2} spacing="md">
              <Stack>
                <TextInput
                  placeholder="Tone...(default: Professional and informative)"
                  value={tone}
                  label="Tone"
                  size={"md"}
                  onChange={(e) => setTone(e.target.value)}
                />
                <NumberInput
                  label="Word Count"
                  placeholder="word count...(default: 1500)"
                  value={wordCount}
                  // variant="unstyled"
                  size={"md"}
                  onChange={(e) => setWordCount(Number(e))}
                />
              </Stack>
              <Stack>
                <TextInput
                  // variant="unstyled"
                  size={"md"}
                  label="Language"
                  placeholder="Language..."
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
                <TextInput
                  size={"md"}
                  withAsterisk
                  label="Keywords"
                  placeholder="Keywords..."
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </Stack>
            </SimpleGrid>
            <Button
              onClick={handleSubmit}
              style={{
                background:
                  title && keywords
                    ? "linear-gradient(45deg, #ff007f, #7f00ff, #00c9ff)"
                    : "gray",
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
                opacity: title && keywords ? 1 : 0.5,
              }}
              disabled={loading || !title || !keywords}
            >
              {loading ? <Loader color={"white"} size="sm" /> : "AI Generate"}
              {loading || !title || !keywords ? null : (
                <div className="shine" />
              )}
            </Button>
          </div>
          <Divider orientation="horizontal" my={"xl"} />

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
