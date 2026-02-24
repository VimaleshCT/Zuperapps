import {
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
} from "@hubspot/ui-extensions";

export default function ReusableTable({
    columns,
    data,
    page,
    pageCount,
    onPageChange,
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

                       
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}