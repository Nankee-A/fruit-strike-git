export class Animator
{
    static to(target, duration, vars, easeIn, easeOut)
    {
        if (easeIn && easeOut)
        {
            vars.ease = Elastic.easeInOut;
        }
        else if (easeIn)
        {
            vars.ease = Elastic.easeIn;
        }
        else if (easeOut)
        {
            vars.ease = Elastic.easeOut
        }

        return TweenMax.to(target, duration, vars);
    }

    static set(target, vars)
    {
        return TweenMax.set(target, vars);
    }

    static kill(animation)
    {
        animation?.kill();
    }
}