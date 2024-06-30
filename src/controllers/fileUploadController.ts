import fileUpload from "express-fileupload";

export const fileUploadController = {
    async save(file: fileUpload.UploadedFile): Promise<{
        fileName: string;
        filePath: string;
    }> {
        const UFileName = `${new Date().getTime()}-${file.name.replace(/ /g, "-")}`;

        file.mv(`${process.cwd()}/src/public/uploads/${UFileName}`, async (err) => {
            if (err) {
                console.error(err);
                throw new Error('Erro ao salvar arquivo');
            }
        });

        return { fileName: UFileName, filePath: `/uploads/${UFileName}` }
    }
};