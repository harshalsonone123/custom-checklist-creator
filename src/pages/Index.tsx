
import { useState } from "react";
import { Plus, Send, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

const Index = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newItem, setNewItem] = useState("");
  const { toast } = useToast();

  const createChecklist = () => {
    if (!newTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a checklist title",
        variant: "destructive",
      });
      return;
    }

    const newChecklist: Checklist = {
      id: Date.now().toString(),
      title: newTitle,
      items: [],
    };

    setChecklists([...checklists, newChecklist]);
    setNewTitle("");
    
    toast({
      title: "Success",
      description: "Checklist created successfully",
    });
  };

  const addItem = (checklistId: string) => {
    if (!newItem.trim()) {
      toast({
        title: "Error",
        description: "Please enter an item",
        variant: "destructive",
      });
      return;
    }

    setChecklists(
      checklists.map((list) => {
        if (list.id === checklistId) {
          return {
            ...list,
            items: [
              ...list.items,
              {
                id: Date.now().toString(),
                text: newItem,
                completed: false,
              },
            ],
          };
        }
        return list;
      })
    );
    setNewItem("");
  };

  const toggleItem = (checklistId: string, itemId: string) => {
    setChecklists(
      checklists.map((list) => {
        if (list.id === checklistId) {
          return {
            ...list,
            items: list.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, completed: !item.completed };
              }
              return item;
            }),
          };
        }
        return list;
      })
    );
  };

  const shareChecklist = (checklistId: string) => {
    // TODO: Implement sharing functionality
    toast({
      title: "Coming Soon",
      description: "Sharing functionality will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Custom Checklist Creator</h1>
          <p className="text-lg text-muted-foreground">
            Create and share custom checklists with your clients
          </p>
        </div>

        <Card className="p-6 backdrop-blur-sm bg-card/50">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">New Checklist Title</Label>
              <div className="flex space-x-2">
                <Input
                  id="title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter checklist title..."
                  className="flex-1"
                />
                <Button onClick={createChecklist}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6">
          {checklists.map((checklist) => (
            <motion.div
              key={checklist.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 space-y-4 backdrop-blur-sm bg-card/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{checklist.title}</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareChecklist(checklist.id)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="space-y-2">
                  {checklist.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center space-x-2"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-6 h-6 p-0 ${
                          item.completed ? "bg-primary text-primary-foreground" : ""
                        }`}
                        onClick={() => toggleItem(checklist.id, item.id)}
                      >
                        {item.completed && <Check className="h-4 w-4" />}
                      </Button>
                      <span
                        className={`flex-1 ${
                          item.completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add new item..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addItem(checklist.id);
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={() => addItem(checklist.id)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
