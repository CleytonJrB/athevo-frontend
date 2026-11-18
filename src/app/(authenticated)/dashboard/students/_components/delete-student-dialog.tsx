import { LoaderCircle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Student } from "@/types/student"

interface DeleteStudentDialogProps {
  deleting: boolean
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
  student: Student | null
}

export function DeleteStudentDialog({
  deleting,
  onConfirm,
  onOpenChange,
  student,
}: DeleteStudentDialogProps) {
  return (
    <Dialog
      open={student !== null}
      onOpenChange={(open) => {
        if (!deleting) onOpenChange(open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir aluno da academia?</DialogTitle>
          <DialogDescription>
            {student?.name} perderá o acesso a esta academia e a matrícula atual será
            encerrada.
          </DialogDescription>
        </DialogHeader>

        <div className="p-5 text-sm text-on-surface-variant">
          A conta global e o histórico financeiro serão preservados. Depois da
          exclusão, será possível cadastrar novamente os mesmos dados.
        </div>

        <DialogFooter>
          <DialogClose
            render={
              <Button type="button" variant="outline" size="sm" disabled={deleting} />
            }
          >
            Cancelar
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={deleting}
            onClick={onConfirm}
          >
            {deleting ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : (
              <Trash2 aria-hidden="true" />
            )}
            {deleting ? "Excluindo..." : "Excluir aluno"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
