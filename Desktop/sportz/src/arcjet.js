import arcjet,{shield,detectBot,slidingWindow} from '@arcjet/node'

const arcjetKey = process.env.ARCJET_API_KEY;
const arcjetMode = process.env.ARCJET_MODE === 'DRY_RUN' ? 'DRY_RUN' : 'LIVE';

if(!arcjetKey) throw new Error('ARCJET_API_KEY is missing or invalid');

export const httpArcjet = arcjetKey ?
    arcjet({
        key:arcjetKey,
        rules:[
            shield({mode:arcjetMode}),
            detectBot({mode:arcjetMode,allow:['CATEGORYY:SEARCH_ENGINE','CATEGORY:PREVIEW']}),
            slidingWindow({mode:arcjetMode,interval:'10s',max:50})
        ],

    }): null;


export const wsArcjet = arcjetKey ?
    arcjet({

        key:arcjetKey,
        rules:[
            shield({mode:arcjetMode}),
            detectBot({mode:arcjetMode,allow:['CATEGORYY:SEARCH_ENGINE','CATEGORY:PREVIEW']}),
            slidingWindow({mode:arcjetMode,interval:'2s',max:5})
        ],


    }): null;


export function securityMiddleware(){
    return async(req,res,next)=>{
        if(!httpArcjet) return next();

        try{
            const decision = await httpArcjet.protect(req);

            if (decision.isDenied()){
                if(decision.reason.isRateLimit()){
                    return res.status(429).json({error:'Too many Requests'});

                }
                return res.status(403).json({error:'Forbidden'});
            }

        } catch(e){
            console.error('Arcjet Middleware Error',e);
            return res.status(502).json({error:'Service Unavailable'});
        }
        next();
    }
}