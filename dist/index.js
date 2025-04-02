"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const supabase_1 = __importDefault(require("./utilities/supabase"));
const app = (0, express_1.default)();
const port = 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.body.files;
    try {
        console.log(file);
        // TODO: Replace wid nanoid
        const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
        const { data, error } = yield supabase_1.default.storage.from("vibe").upload(id, file, {
            cacheControl: "3600",
            upsert: true,
            contentType: file.type,
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
    }
}));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.default.storage.from("vibe").list();
    if (error)
        return console.log(error);
    res.json({ data });
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// Testing
