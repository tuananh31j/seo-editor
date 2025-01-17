/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Group,
  ActionIcon,
  Box,
  Text,
  TagsInput,
} from "@mantine/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { SideMenuController } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import "./App.css";
import { useDocumentTitle, useScrollIntoView } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_API_URL;
const initValues = {
  sections: [],
  title: "",
  language: "tiếng Việt",
  tone: "Professional and informative",
  word_count: 1500,
  keywords: [],
};
export default function App() {
  useDocumentTitle("AI Editor");
  const notify = () => toast.error("Something wrong!");
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });
  const form = useForm({
    mode: "uncontrolled",
    initialValues: initValues,
    validate: {
      title: (value) => (value != "" ? null : "Title is require"),
    },
  });
  const [loading, setLoading] = useState(false);

  const [blocks, setBlocks] = useState<any>();

  const schema = BlockNoteSchema.create({
    blockSpecs: defaultBlockSpecs,
  });

  const editor = useCreateBlockNote({
    schema: schema,
    initialContent: blocks,
  });

  const fields =
    form.getValues().sections.length > 0
      ? form.getValues().sections.map((item, index) => (
          <Group key={item} mt="xs">
            <TextInput
              placeholder="Heading..."
              withAsterisk
              style={{ flex: 1 }}
              key={form.key(`sections.${index}.name`)}
              {...form.getInputProps(`sections.${index}.name`)}
            />
            <ActionIcon
              color="red"
              onClick={() => form.removeListItem("sections", index)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        ))
      : [];
  const handleReset = () => {
    form.resetDirty();
    form.setValues(initValues);
    setBlocks([]);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    console.log(values);
    const body = {
      ...values,
      sections: values.sections.map((item: any) => item.name),
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      setBlocks(data.content);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      notify();
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    async function loadToHTML() {
      const blocksFromMarkdown = await editor.tryParseMarkdownToBlocks(blocks);
      await editor.replaceBlocks(editor.document, blocksFromMarkdown);
    }
    loadToHTML();
  });

  return (
    <AppShell>
      <AppShell.Main>
        <Container size="xl">
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <TextInput
              placeholder="Title..."
              label="Title"
              withAsterisk
              size={"xl"}
              key={form.key("title")}
              {...form.getInputProps("title")}
            />
            <Box>
              {fields.length > 0 ? (
                <Group my="xs">
                  <Text fw={500} size={"md"} style={{ flex: 1 }}>
                    Heading
                  </Text>
                </Group>
              ) : (
                ""
              )}

              {fields}

              <Group mt="md">
                <Button
                  onClick={() =>
                    form.insertListItem("sections", {
                      name: "",
                    })
                  }
                >
                  Add heading
                </Button>
              </Group>
            </Box>
            <SimpleGrid cols={2} spacing="md">
              <Stack>
                <TextInput
                  placeholder="Tone...(default: Professional and informative)"
                  label="Tone"
                  size={"md"}
                  key={form.key("tone")}
                  {...form.getInputProps("tone")}
                />
                <NumberInput
                  label="Word Count"
                  placeholder="word count...(default: 1500)"
                  size={"md"}
                  key={form.key("word_count")}
                  {...form.getInputProps("word_count")}
                />
              </Stack>
              <Stack>
                <TextInput
                  // variant="unstyled"
                  size={"md"}
                  label="Language"
                  placeholder="Language..."
                  key={form.key("language")}
                  {...form.getInputProps("language")}
                />
                <TagsInput
                  label="Keywords"
                  placeholder="Enter keywords..."
                  size={"md"}
                  key={form.key("keywords")}
                  {...form.getInputProps("keywords")}
                />
              </Stack>
            </SimpleGrid>
            <div
              style={{
                position: "fixed",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                bottom: "20px",
                right: "20px",
                zIndex: 1000,
              }}
            >
              <Button
                onClick={handleReset}
                variant="outline"
                style={{
                  fontWeight: "bold",
                  borderRadius: "12px",
                  padding: "12px 24px",
                  overflow: "hidden",
                  textTransform: "uppercase",
                }}
              >
                Reset
              </Button>
              <Button
                onClick={() =>
                  scrollIntoView({
                    alignment: "start",
                  })
                }
                type="submit"
                style={{
                  background: form.isValid()
                    ? "linear-gradient(45deg, #ff007f, #7f00ff, #00c9ff)"
                    : "gray",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  padding: "12px 24px",
                  border: "2px solid transparent",

                  overflow: "hidden",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                  textTransform: "uppercase",
                  opacity: form.isValid() ? 1 : 0.5,
                }}
                disabled={loading || !form.isValid()}
              >
                {loading ? <Loader color={"white"} size="sm" /> : "AI Generate"}
                {loading || !form.isValid() ? null : <div className="shine" />}
              </Button>
            </div>
          </form>
          <Divider orientation="horizontal" my={"xl"} />

          <div ref={targetRef}>
            {loading ? (
              <Stack gap="md">
                <Skeleton
                  c={"red"}
                  height={40}
                  mt={6}
                  width="50%"
                  radius="xl"
                />
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
                  style={{
                    position: "relative",
                    display: "flex",
                    zIndex: 1000,
                  }}
                >
                  <SideMenuController />
                </div>
              </BlockNoteView>
            )}
          </div>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
