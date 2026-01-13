"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload } from "lucide-react";

export const FileUpload = ({ field, label }: { field: any; label: string }) => {
    const [fileName, setFileName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            field.onChange(event.target.files);
        }
    };

    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <div
                    className="relative flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card/60 hover:bg-muted"
                    onClick={() => inputRef.current?.click()}
                >
                    <Input
                        type="file"
                        ref={inputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    {fileName ? (
                        <p className="text-sm text-foreground">{fileName}</p>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Upload className="w-8 h-8" />
                            <p className="mt-2 text-sm">Click to upload</p>
                        </div>
                    )}
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
};
