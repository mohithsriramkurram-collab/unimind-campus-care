import ReactMarkdown from "react-markdown";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export function ResourceViewer({ resource, onClose }) {
  return (
    <Dialog open={!!resource} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        {resource && (
          <>
            <DialogHeader>
              <div
                className="-mx-6 -mt-6 mb-2 h-28 w-[calc(100%+3rem)]"
                style={{ background: resource.cover_color || "linear-gradient(135deg, hsl(162 30% 40%), hsl(162 30% 60%))" }}
              />
              <Badge variant="secondary" className="mb-2 w-fit capitalize">
                {resource.category}
              </Badge>
              <DialogTitle className="font-heading text-2xl font-semibold tracking-tight">{resource.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {resource.read_time_minutes || 5} min
                </span>
                <span className="capitalize">{resource.type}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="prose prose-sm max-w-none text-foreground/90">
              <p className="text-base italic text-muted-foreground">{resource.summary}</p>
              <ReactMarkdown
                components={{
                  h1: ({ node, ...p }) => <h2 className="mt-6 font-heading text-xl font-semibold" {...p} />,
                  h2: ({ node, ...p }) => <h3 className="mt-5 font-heading text-lg font-semibold" {...p} />,
                  p: ({ node, ...p }) => <p className="my-3 leading-relaxed" {...p} />,
                  ul: ({ node, ...p }) => <ul className="my-3 list-disc space-y-1.5 pl-5" {...p} />,
                  ol: ({ node, ...p }) => <ol className="my-3 list-decimal space-y-1.5 pl-5" {...p} />,
                }}
              >
                {resource.content}
              </ReactMarkdown>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}