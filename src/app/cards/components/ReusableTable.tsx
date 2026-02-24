import {
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    Text,
} from "@hubspot/ui-extensions";

export default function ReusableTable({
    columns,
    data,
    page,
    pageCount,
    onPageChange,
    onDelete,
}: any) {
    return (
        <Table
            bordered
            paginated
            pageCount={pageCount}
            page={page}
            onPageChange={onPageChange}
            showButtonLabels
            showFirstLastButtons
        >
            <TableHead>
                <TableRow>
                    {columns.map((col: any) => (
                        <TableHeader key={col.key} width={"min"}>
                            {col.label}
                        </TableHeader>
                    ))}
                    <TableHeader width="min">ACTIONS</TableHeader>
                </TableRow>
            </TableHead>

            <TableBody>
                {data.map((row: any) => (
                    <TableRow key={row.id}>
                        {columns.map((col: any) => (
                            <TableCell key={col.key} width={"min"}>
                                {row[col.key]}
                            </TableCell>
                        ))}

                        <TableCell>
                            <Button
                                variant="destructive"
                                size="small"
                                overlay={
                                    <Modal id={`delete-${row.id}`} title="Confirm Delete">
                                        <ModalBody>
                                            <Text>
                                                Are you sure you want to delete this log?
                                            </Text>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button variant="secondary">Cancel</Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => onDelete(row.id)}
                                            >
                                                Delete
                                            </Button>
                                        </ModalFooter>
                                    </Modal>
                                }
                            >
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}