<?php
class TOTP {
    public static function generateSecret($length = 16) {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $secret = '';
        for ($i = 0; $i < $length; $i++) {
            $secret .= $characters[random_int(0, strlen($characters) - 1)];
        }
        return $secret;
    }

    public static function getQRCodeUrl($label, $secret) {
        $otpauth = sprintf('otpauth://totp/%s?secret=%s&issuer=%s',
            rawurlencode($label),
            $secret,
            rawurlencode(APP_NAME)
        );
        return 'https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=' . urlencode($otpauth);
    }

    public static function verifyCode($secret, $code, $discrepancy = 1, $currentTimeSlice = null) {
        if ($currentTimeSlice === null) {
            $currentTimeSlice = floor(time() / 30);
        }
        for ($i = -$discrepancy; $i <= $discrepancy; $i++) {
            $calculated = self::getCode($secret, $currentTimeSlice + $i);
            if (hash_equals($calculated, str_pad($code, 6, '0', STR_PAD_LEFT))) {
                return true;
            }
        }
        return false;
    }

    public static function getCode($secret, $timeSlice = null) {
        if ($timeSlice === null) {
            $timeSlice = floor(time() / 30);
        }
        $secretKey = self::base32Decode($secret);
        $time = chr(0) . chr(0) . chr(0) . chr(0) . pack('N*', $timeSlice);
        $hm = hash_hmac('sha1', $time, $secretKey, true);
        $offset = ord(substr($hm, -1)) & 0x0F;
        $hashPart = substr($hm, $offset, 4);
        $value = unpack('N', $hashPart)[1] & 0x7fffffff;
        $modulo = $value % 1000000;
        return str_pad($modulo, 6, '0', STR_PAD_LEFT);
    }

    private static function base32Decode($secret) {
        if (empty($secret)) {
            return '';
        }
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $secret = strtoupper($secret);
        $output = '';
        $buffer = 0;
        $bitsLeft = 0;
        for ($i = 0; $i < strlen($secret); $i++) {
            $val = strpos($alphabet, $secret[$i]);
            if ($val === false) {
                continue;
            }
            $buffer = ($buffer << 5) | $val;
            $bitsLeft += 5;
            if ($bitsLeft >= 8) {
                $bitsLeft -= 8;
                $output .= chr(($buffer >> $bitsLeft) & 0xFF);
            }
        }
        return $output;
    }
}
?>
