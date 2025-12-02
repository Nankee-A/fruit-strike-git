export class Animator
{
    static to(target, duration, vars, easeIn, easeOut)
    {
        var ease;
        if (easeIn && easeOut)
        {
            ease = Elastic.easeInOut;
        }
        else if (easeIn)
        {
            ease = Elastic.easeIn;
        }
        else if (easeOut)
        {
            ease = Elastic.easeOut
        }
        else
        {
            return TweenMax.to(target, duration, { attr: vars.attr });
        }

        return TweenMax.to(target, duration, { attr: vars.attr, ease: ease });
    }

    static kill(animation)
    {
        animation?.kill();
    }
}