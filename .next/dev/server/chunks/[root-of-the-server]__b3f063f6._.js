module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Desktop/vercel/smile-schedule-dash/src/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$mongodb$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs, [project]/Desktop/vercel/smile-schedule-dash/node_modules/mongodb)");
;
if (!process.env.VITE_MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env');
}
const uri = process.env.VITE_MONGODB_URI;
const options = {};
let client;
let clientPromise;
if ("TURBOPACK compile-time truthy", 1) {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!/*TURBOPACK member replacement*/ __turbopack_context__.g._mongoClientPromise) {
        client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$mongodb$29$__["MongoClient"](uri, options);
        /*TURBOPACK member replacement*/ __turbopack_context__.g._mongoClientPromise = client.connect();
    }
    clientPromise = /*TURBOPACK member replacement*/ __turbopack_context__.g._mongoClientPromise;
} else //TURBOPACK unreachable
;
const __TURBOPACK__default__export__ = clientPromise;
}),
"[project]/Desktop/vercel/smile-schedule-dash/src/app/api/[collection]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/vercel/smile-schedule-dash/src/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$mongodb$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs, [project]/Desktop/vercel/smile-schedule-dash/node_modules/mongodb)");
;
;
;
async function getDb() {
    const client = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"];
    return client.db(process.env.VITE_DB_NAME || "smile_schedule_db");
}
function convertObjectIds(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    for(const key in obj){
        const val = obj[key];
        if (typeof val === 'string' && val.length === 24) {
            if (key === '_id' || key.endsWith('_id') || key.toLowerCase().includes('userid')) {
                try {
                    obj[key] = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$mongodb$29$__["ObjectId"](val);
                } catch (e) {}
            }
        } else if (val && typeof val === 'object') {
            if (val.$in && Array.isArray(val.$in)) {
                val.$in = val.$in.map((v)=>typeof v === 'string' && v.length === 24 ? new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$mongodb$29$__["ObjectId"](v) : v);
            } else {
                convertObjectIds(val);
            }
        }
    }
    return obj;
}
async function GET(req, { params }) {
    try {
        const { collection } = await params;
        const db = await getDb();
        const { searchParams } = new URL(req.url);
        const filter = searchParams.get("filter") ? JSON.parse(searchParams.get("filter")) : {};
        const sort = searchParams.get("sort") ? JSON.parse(searchParams.get("sort")) : {};
        const limit = parseInt(searchParams.get("limit") || "0");
        convertObjectIds(filter);
        let query = db.collection(collection).find(filter).sort(sort);
        if (limit > 0) query = query.limit(limit);
        const data = await query.toArray();
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data,
            error: null
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: null,
            error: error.message
        }, {
            status: 500
        });
    }
}
async function POST(req, { params }) {
    try {
        const { collection } = await params;
        const db = await getDb();
        const body = await req.json();
        if (body.operation === 'findOne' || body.filter) {
            const filter = body.filter || {};
            convertObjectIds(filter);
            const data = await db.collection(collection).findOne(filter);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                data,
                error: null
            });
        }
        // Default to insertOne for legacy compatibility or if specified
        const doc = body.document || body;
        convertObjectIds(doc);
        const result = await db.collection(collection).insertOne(doc);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: {
                ...doc,
                _id: result.insertedId
            },
            error: null
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: null,
            error: error.message
        }, {
            status: 500
        });
    }
}
async function PUT(req, { params }) {
    try {
        const { collection } = await params;
        const db = await getDb();
        const body = await req.json();
        const filter = body.filter || {};
        convertObjectIds(filter);
        const update = body.update || {};
        // If it's a plain update, wrap it in $set
        const finalUpdate = update.$set || update.$push || update.$pull ? update : {
            $set: update
        };
        const result = await db.collection(collection).findOneAndUpdate(filter, finalUpdate, {
            returnDocument: 'after'
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: result,
            error: null
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: null,
            error: error.message
        }, {
            status: 500
        });
    }
}
async function DELETE(req, { params }) {
    try {
        const { collection } = await params;
        const db = await getDb();
        const body = await req.json();
        const filter = body.filter || {};
        convertObjectIds(filter);
        const result = await db.collection(collection).deleteOne(filter);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: result,
            error: null
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$vercel$2f$smile$2d$schedule$2d$dash$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: null,
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b3f063f6._.js.map