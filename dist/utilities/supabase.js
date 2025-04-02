"use strict";
// src/utilities/supabase.ts
// Dummy export for pipeline to run
// To be replaced with other DB-structure
// Made by GPT
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase = {
    storage: {
        from: (bucketName) => ({
            upload: (id, file, options) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(`Mock upload to bucket ${bucketName} with id ${id}`);
                return { data: null, error: null };
            }),
            list: () => __awaiter(void 0, void 0, void 0, function* () {
                console.log("Mock list from bucket");
                return { data: [], error: null };
            }),
        }),
    },
};
exports.default = supabase;
