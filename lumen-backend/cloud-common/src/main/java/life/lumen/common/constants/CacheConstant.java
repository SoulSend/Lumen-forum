package life.lumen.common.constants;


public class CacheConstant {
    public static final String CODE_PREFIX="auth:code:";
    public static final String TOKEN_PREFIX="auth:token:";
    public static final String SESSION_PREFIX ="auth:session:";
    public static final String SESSION_TO_TOKEN="auth:session_toToken:";

    public static final int SESSION_EXPIRE_SECONDS=1800;
    public static final int CODE_EXPIRE_SECONDS=300;
}
